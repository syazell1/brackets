use std::collections::HashSet;

use anyhow::{anyhow, Context};
use chrono::Utc;
use sqlx::{Executor, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{CommentLikeIds, CommentLikeStatus, PostLikeIds, PostLikeStatus},
    utils::uuid_parser,
};

#[tracing::instrument(name = "Adding likes to post", skip(post_id, user_id, pool))]
pub async fn add_like_to_post(
    post_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let id = Uuid::new_v4();
    let date = Utc::now();
    let post_id = uuid_parser(post_id)?;

    let query = sqlx::query!(
        r#"
            INSERT INTO like_posts (id, post_id, user_id, created_at) 
            VALUES
            ($1, $2, $3, $4)
        "#,
        id,
        post_id,
        user_id,
        date
    );

    pool.execute(query)
        .await
        .context("Failed to insert likes from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Removing likes to post", skip(post_id, user_id, pool))]
pub async fn remove_like_to_post(
    post_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let post_id = uuid_parser(post_id)?;

    let query = sqlx::query!(
        r#"
            DELETE FROM like_posts WHERE post_id = $1 AND user_id = $2
        "#,
        post_id,
        user_id
    );

    pool.execute(query)
        .await
        .context("Failed to insert likes from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Checking post like", skip(post_id, user_id, pool))]
pub async fn check_post_like(
    post_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let post_id = uuid_parser(post_id)?;

    let query = sqlx::query!(
        r#"
            SELECT id FROM like_posts WHERE post_id = $1 AND user_id = $2
        "#,
        post_id,
        user_id
    );

    let result = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch likes from the database.")
        .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => Ok(()),
        None => return Err(AppError::NotFoundError(anyhow!("Post like was not found."))),
    }
}

#[tracing::instrument(name = "Checking Posts like status", skip(post, user_id, pool))]
pub async fn get_liked_posts(
    post: &PostLikeIds,
    user_id: &Uuid,
    pool: &PgPool,
) -> Result<Vec<PostLikeStatus>, AppError> {
    let mut ids: HashSet<Uuid> = HashSet::new();

    for v in post.post_ids.iter() {
        if ids.contains(v) {
            return Err(AppError::BadRequestError(anyhow!("Duplicate Post Id.")));
        }

        ids.insert(v.to_owned());
    }

    let mut post_like_status: Vec<PostLikeStatus> = Vec::new();
    for id in ids.iter() {
        let result = sqlx::query!(
            r#"
                SELECT id FROM like_posts WHERE post_id = $1 AND user_id = $2
            "#,
            id,
            user_id
        )
        .fetch_optional(pool)
        .await
        .context("Failed to fetch likes from the database")
        .map_err(AppError::UnexpectedError)?;

        match result {
            Some(_) => {
                let post_status = PostLikeStatus::new(true, id.to_owned());
                post_like_status.push(post_status)
            }
            None => {
                let post_status = PostLikeStatus::new(false, id.to_owned());
                post_like_status.push(post_status)
            }
        }
    }

    Ok(post_like_status)
}

#[tracing::instrument(name = "Adding likes to comment", skip(comment_id, user_id, pool))]
pub async fn add_like_to_comment(
    comment_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let id = Uuid::new_v4();
    let date = Utc::now();
    let comment_id = uuid_parser(comment_id)?;

    let query = sqlx::query!(
        r#"
            INSERT INTO like_comments (id, comment_id, user_id, created_at) 
            VALUES
            ($1, $2, $3, $4)
        "#,
        id,
        comment_id,
        user_id,
        date
    );

    pool.execute(query)
        .await
        .context("Failed to insert likes from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Removing likes to comment", skip(comment_id, user_id, pool))]
pub async fn remove_like_to_comment(
    comment_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let comment_id = uuid_parser(comment_id)?;

    let query = sqlx::query!(
        r#"
            DELETE FROM like_comments WHERE comment_id = $1 AND user_id = $2
        "#,
        comment_id,
        user_id
    );

    pool.execute(query)
        .await
        .context("Failed to insert likes from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Checking comment like", skip(comment_id, user_id, pool))]
pub async fn check_comment_like(
    comment_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let comment_id = uuid_parser(comment_id)?;

    let query = sqlx::query!(
        r#"
            SELECT id FROM like_comments WHERE comment_id = $1 AND user_id = $2
        "#,
        comment_id,
        user_id
    );

    let result = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch likes from the database.")
        .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => Ok(()),
        None => {
            return Err(AppError::NotFoundError(anyhow!(
                "Comment Like was not found."
            )))
        }
    }
}

#[tracing::instrument(name = "Checking Comments like status", skip(comments, user_id, pool))]
pub async fn get_liked_comments(
    comments: &CommentLikeIds,
    user_id: &Uuid,
    pool: &PgPool,
) -> Result<Vec<CommentLikeStatus>, AppError> {
    let mut ids: HashSet<Uuid> = HashSet::new();

    for v in comments.comment_ids.iter() {
        if ids.contains(v) {
            return Err(AppError::BadRequestError(anyhow!("Duplicate Comment Id.")));
        }

        ids.insert(v.to_owned());
    }

    let mut comment_like_status: Vec<CommentLikeStatus> = Vec::new();
    for id in ids.iter() {
        let result = sqlx::query!(
            r#"
                SELECT id FROM like_comments WHERE comment_id = $1 AND user_id = $2
            "#,
            id,
            user_id
        )
        .fetch_optional(pool)
        .await
        .context("Failed to fetch likes from the database")
        .map_err(AppError::UnexpectedError)?;

        match result {
            Some(_) => {
                let post_status = CommentLikeStatus::new(true, id.to_owned());
                comment_like_status.push(post_status)
            }
            None => {
                let post_status = CommentLikeStatus::new(false, id.to_owned());
                comment_like_status.push(post_status)
            }
        }
    }

    Ok(comment_like_status)
}
