use anyhow::Context;
use chrono::Utc;
use sqlx::{Executor, Postgres, Transaction};
use uuid::Uuid;

use crate::errors::AppError;

#[tracing::instrument(name = "Following user", skip(follower_id, followee_id, pool))]
pub async fn follow_user(
    follower_id: &Uuid,
    followee_id: &Uuid,
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
    follower_id: &Uuid,
    followee_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            DELETE FROM follows WHERE followee_id = $1 AND follower_id = $2 
        "#,
        follower_id,
        followee_id,
    );

    pool.execute(query)
        .await
        .context("Failed to unfollow user.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}
