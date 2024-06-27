use anyhow::Context;
use chrono::Utc;
use sqlx::{Executor, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{PageList, UserInfo},
};

#[tracing::instrument(name = "Verifying user follow status")]
pub async fn get_user_following_status(
    followee_id: Uuid,
    follower_id: Uuid,
    pool: &PgPool,
) -> Result<bool, AppError>{
    let result = sqlx::query!(
        r#"
            SELECT id FROM follows WHERE followee_id = $1 AND follower_id = $2 
        "#,
        followee_id,
        follower_id
    ).fetch_optional(pool).await?;

    if result.is_none() {
       return Ok(false);
    };

    Ok(true)
}

#[tracing::instrument(name = "Verifying user follow status")]
pub async fn verify_user_follow_status(
    followee_id: Uuid,
    follower_id: Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            SELECT id FROM follows WHERE followee_id = $1 AND follower_id = $2 
        "#,
        followee_id,
        follower_id
    );

    let result = pool.fetch_optional(query).await?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::NotFoundError(
            "User following status was not found.".into(),
        )),
    }
}

#[tracing::instrument(name = "Following user", skip(follower_id, followee_id, pool))]
pub async fn follow_user(
    follower_id: Uuid,
    followee_id: Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let id = Uuid::new_v4();
    let date = Utc::now();
    let query = sqlx::query!(
        r#"
            INSERT INTO follows (id, follower_id, followee_id, created_at)
            VALUES
            ($1, $2, $3, $4)
        "#,
        id,
        follower_id,
        followee_id,
        date
    );

    pool.execute(query)
        .await
        .context("Failed to follow user.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Unfollowing user", skip(follower_id, followee_id, pool))]
pub async fn unfollow_user(
    follower_id: Uuid,
    followee_id: Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            DELETE FROM follows WHERE followee_id = $1 AND follower_id = $2 
        "#,
        followee_id,
        follower_id
    );

    pool.execute(query).await?;

    Ok(())
}

#[tracing::instrument(
    name = "Fetching Users Followers",
    skip(followee_id, current_page, page_size, pool)
)]
pub async fn get_users_followers(
    followee_id: &Uuid,
    current_page: u32,
    page_size: u32,
    pool: &PgPool,
) -> Result<PageList<Vec<UserInfo>>, AppError> {
    let page = page_size * (current_page - 1);
    let result = sqlx::query_as!(
        UserInfo,
        r#"
           SELECT u.id, u.username FROM follows f 
           INNER JOIN users u ON u.id = f.follower_id
           WHERE followee_id = $1
           OFFSET $2
           LIMIT $3
        "#,
        followee_id,
        page as i64,
        page_size as i64
    )
    .fetch_all(pool)
    .await
    .context("Failed to fetch users followers")
    .map_err(AppError::UnexpectedError)?;

    let total_items_count = sqlx::query_scalar!(
        r#"
            SELECT count(id) FROM follows
            WHERE follower_id = $1
           "#,
        followee_id
    )
    .fetch_one(pool)
    .await
    .context("Failed to fetch users followers count")
    .map_err(AppError::UnexpectedError)?;

    let pr = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(pr)
}

#[tracing::instrument(name = "Fetching Users Followings")]
pub async fn get_users_followings(
    followee_id: &Uuid,
    current_page: u32,
    page_size: u32,
    pool: &PgPool,
) -> Result<PageList<Vec<UserInfo>>, AppError> {
    let page = page_size * (current_page - 1);
    let result = sqlx::query_as!(
        UserInfo,
        r#"
           SELECT u.id, u.username FROM follows f 
           INNER JOIN users u ON u.id = f.followee_id
           WHERE follower_id = $1
           OFFSET $2
           LIMIT $3
        "#,
        followee_id,
        page as i64,
        page_size as i64
    )
    .fetch_all(pool)
    .await
    .context("Failed to fetch users followers")
    .map_err(AppError::UnexpectedError)?;

    let total_items_count = sqlx::query_scalar!(
        r#"
            SELECT count(id) FROM follows
            WHERE followee_id = $1
           "#,
        followee_id
    )
    .fetch_one(pool)
    .await
    .context("Failed to fetch users followers count")
    .map_err(AppError::UnexpectedError)?;

    let pr = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(pr)
}
