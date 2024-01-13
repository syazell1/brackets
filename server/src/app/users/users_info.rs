use anyhow::Context;
use chrono::Utc;
use sqlx::{Executor, Postgres, Transaction};
use uuid::Uuid;

use crate::{errors::AppError, models::UsersRegistrationInput};

pub async fn create_users_info(
    user_id: &Uuid,
    credentials: &UsersRegistrationInput,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let id = Uuid::new_v4();
    let date = Utc::now();

    let query = sqlx::query!(
        r#"
            INSERT INTO users_info (id, first_name, last_name, email, user_id, created_at)
            VALUES
            ($1, $2, $3, $4, $5, $6)
        "#,
        id,
        credentials.first_name,
        credentials.last_name,
        credentials.email,
        user_id,
        date
    );

    pool.execute(query)
        .await
        .context("Failed to insert users info from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(
    name = "Updating Users Information from the database",
    skip(user_id, credentials, pool)
)]
pub async fn update_users_info(
    user_id: &Uuid,
    credentials: &UsersRegistrationInput,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let date = Utc::now();

    let query = sqlx::query!(
        r#"
                UPDATE users_info 
                SET first_name = $1, last_name = $2, email = $3, 
                bio = $4, updated_at = $5
                WHERE user_id = $6
        "#,
        credentials.first_name,
        credentials.last_name,
        credentials.email,
        credentials.bio,
        date,
        user_id
    );

    pool.execute(query)
        .await
        .context("Failed to update user information from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}
