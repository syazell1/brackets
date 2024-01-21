use anyhow::{anyhow, Context};
use chrono::Utc;
use sqlx::{Executor, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{CommentData, CommentInput, CommentOwner, PageList},
    utils::uuid_parser,
};

#[tracing::instrument(name = "Adding comments to the database", skip(comment, user_id, pool))]
pub async fn add_comments_to_post(
    comment: &CommentInput,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let id = Uuid::new_v4();
    let date = Utc::now();

    let post_id = uuid_parser(&comment.post_id)?;

    let query = sqlx::query!(
        r#"
            INSERT INTO comments (id, content, post_id, owner_id, created_at)
            VALUES
            ($1, $2, $3, $4, $5)
        "#,
        id,
        comment.content,
        post_id,
        user_id,
        date
    );

    pool.execute(query)
        .await
        .context("Failed to add comments from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(
    name = "Updating Comments from the database",
    skip(comment_id, comment, user_id, pool)
)]
pub async fn update_comments_by_id(
    comment_id: &Uuid,
    comment: &CommentInput,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let post_id = uuid_parser(&comment.post_id)?;

    let query = sqlx::query!(
        r#"
            UPDATE comments 
            SET content = $1
            WHERE id = $2 AND owner_id = $3 AND post_id = $4
        "#,
        comment.content,
        comment_id,
        user_id,
        post_id
    );

    pool.execute(query)
        .await
        .context("Failed to update comments from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(
    name = "Deleting comments from the database",
    skip(comment_id, user_id, pool)
)]
pub async fn delete_comments_by_id(
    comment_id: &Uuid,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            DELETE FROM comments WHERE id = $1 AND owner_id = $2
        "#,
        comment_id,
        user_id
    );

    pool.execute(query)
        .await
        .context("Failed to delete comments from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(
    name = "Verifying comments from the database",
    skip(comment_id, user_id, pool)
)]
pub async fn verify_comments_by_user_id(
    comment_id: &Uuid,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            SELECT id FROM comments WHERE id = $1 AND owner_id = $2
        "#,
        comment_id,
        user_id,
    );

    let result = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch comments from the database.")
        .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::NotFoundError(anyhow!("Comment was not found."))),
    }
}

#[tracing::instrument(name = "Verifying Comments from the database", skip(comment_id, pool))]
pub async fn verify_comments_by_id(
    comment_id: &str,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let post_id = uuid_parser(comment_id)?;

    let query = sqlx::query!(
        r#"
            SELECT id FROM comments WHERE id = $1
        "#,
        post_id
    );

    let result = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch post from the database.")
        .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => Ok(()),
        None => {
            return Err(AppError::NotFoundError(anyhow::anyhow!(
                "Comment was not found."
            )))
        }
    }
}

#[tracing::instrument(name = "Fetching post's comments from the database")]
pub async fn fetch_posts_comments(
    post_id: &str,
    current_page: u32,
    page_size: u32,
    pool: &PgPool,
) -> Result<PageList<Vec<CommentData>>, AppError> {
    let post_id = uuid_parser(post_id)?;

    let next_page = page_size * (current_page - 1);

    let result = sqlx::query_as!(
        CommentData,
        r#"
            SELECT c.id, c.content, c.created_at, (u.id, u.username) "owner!: CommentOwner",
            (SELECT COUNT(id) FROM like_comments lc WHERE lc.comment_id = c.id) "likes_count! : i64"
            FROM comments c
            INNER JOIN users u ON u.id = c.owner_id
            WHERE post_id = $1
            OFFSET $2
            LIMIT $3
        "#,
        post_id,
        next_page as i32,
        page_size as i32
    )
    .fetch_all(pool)
    .await
    .context("Failed to fetch comments from the database.")
    .map_err(AppError::UnexpectedError)?;

    let total_items_count = sqlx::query_scalar!(
        r#"
            SELECT COUNT(id) FROM comments WHERE post_id = $1
        "#,
        post_id
    )
    .fetch_one(pool)
    .await
    .context("Failed to fetch comments from the database.")
    .map_err(AppError::UnexpectedError)?;

    let pr = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(pr)
}
