use crate::domains::{Credentials, UserInformation};
use crate::models::{UserDetails, UserInfo};
use crate::errors::AppError;
use anyhow::Context;
use argon2::Argon2;
use chrono::Utc;
use password_hash::{PasswordHasher, SaltString};
use sqlx::{Executor, PgPool, Postgres, Transaction};
use uuid::{NoContext, Timestamp, Uuid};

#[tracing::instrument(
    name = "Adding User Credentials from the Database.",
    skip(user_id, credentials, pool)
)]
pub async fn create_user_from_credentials(
    user_id: &Uuid,
    credentials: &Credentials,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let params = argon2::Params::new(15000, 2, 1, None)
        .context("Failed to set Argon2 Params.")
        .map_err(AppError::UnexpectedError)?;
    let hasher = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
    let salt = SaltString::generate(rand::thread_rng());

    let hashed_password = hasher
        .hash_password(credentials.password.as_bytes(), &salt)
        .context("Failed to hash password.")
        .map_err(AppError::UnexpectedError)?;

    let query = sqlx::query!(
        r#"
            INSERT INTO users (id, username, password)
            VALUES 
            ($1, $2, $3)
        "#,
        user_id,
        credentials.username,
        hashed_password.to_string()
    );

    pool.execute(query).await?;

    Ok(())
}

pub async fn create_users_info(
    user_id: &Uuid,
    info: &UserInformation,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let id = Uuid::new_v7(Timestamp::now(NoContext));
    let query = sqlx::query!(
        r#"
            INSERT INTO users_info (id, first_name, last_name, email, user_id, created_at, bio)
            VALUES
            ($1, $2, $3, $4, $5, now(), $6)
        "#,
        id,
        info.first_name,
        info.last_name,
        info.email,
        user_id,
        info.bio
    );

    pool.execute(query).await?;

    Ok(())
}

#[tracing::instrument(
    name = "Validating User from the Database" 
    skip(user_id, pool)
)]
pub async fn validate_user_by_id(
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(r#"SELECT COUNT(id) FROM users WHERE id = $1"#, user_id);

    let row = pool.fetch_optional(query).await?;

    match row {
        Some(_) => Ok(()),
        None => Err(AppError::UnauthorizedError("Invalid User.".into())),
    }
}

#[tracing::instrument(
    name = "Validating User from the Database" 
    skip(username, pool)
)]
pub async fn verify_user_by_username(username: &str, pool: &PgPool) -> Result<(), AppError> {
    let result = sqlx::query!(
        r#"
        SELECT COUNT(id) FROM users WHERE username = $1
        "#,
        username
    )
    .fetch_optional(pool)
    .await?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::NotFoundError("User was not found.".into())),
    }
}

#[tracing::instrument(
    name = "Validating User from the Database" 
    skip(user_id, pool)
)]
pub async fn verify_user_by_id(user_id: &Uuid, pool: &PgPool) -> Result<(), AppError> {
    let result = sqlx::query!(
        r#"
            SELECT id FROM users WHERE id = $1
        "#,
        user_id
    )
    .fetch_optional(pool)
    .await?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::UnauthorizedError("User was not found.".into())),
    }
}

#[tracing::instrument(
    name = "Validating User from the Database" 
    skip(user_id, pool)
)]
pub async fn verify_user_by_id_tx(
    user_id: Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            SELECT id FROM users WHERE id = $1
        "#,
        user_id
    );
    let result = pool.fetch_optional(query).await?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::UnauthorizedError("User was not found.".into())),
    }
}

#[tracing::instrument(name = "fetching user from the database", skip(user_id, pool))]
pub async fn get_user_by_id(user_id: &Uuid, pool: &PgPool) -> Result<UserInfo, AppError> {
    let result = sqlx::query_as!(
        UserInfo,
        r#"
            SELECT id, username FROM users WHERE id = $1
        "#,
        user_id
    )
    .fetch_optional(pool)
    .await?;

    match result {
        Some(data) => Ok(data),
        None => return Err(AppError::UnauthorizedError("User was not found.".into())),
    }
}

#[tracing::instrument(name = "fetching user from the database", skip(username, pool))]
pub async fn get_user_details_by_username(username: &str, pool: &PgPool) -> Result<UserDetails, AppError> {
    let result = sqlx::query_as!(
        UserDetails,
        r#"
            SELECT u.id, u.username, ui.first_name, ui.last_name, ui.email, ui.bio, ui.created_at FROM users u
            INNER JOIN users_info ui ON u.id = ui.user_id
            WHERE username = $1
        "#,
       username 
    )
    .fetch_optional(pool)
    .await?;

    match result {
        Some(data) => Ok(data),
        None => return Err(AppError::NotFoundError(format!("User with username '{}' was not found.", username))),
    }
}

#[tracing::instrument(
    name = "Updating Users Information from the database",
    skip(user_id, info, pool)
)]
pub async fn update_users_info(
    user_id: &Uuid,
    info: &UserInformation,
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
        info.first_name,
        info.last_name,
        info.email,
        info.bio,
        date,
        user_id
    );

    pool.execute(query).await?;

    Ok(())
}
