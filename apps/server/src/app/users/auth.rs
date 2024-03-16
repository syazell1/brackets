use anyhow::Context;
use argon2::Argon2;
use password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use secrecy::ExposeSecret;
use sqlx::{Executor, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{Credentials, UserInfo, UsersRegistrationInput},
};

#[tracing::instrument(
    name = "Adding User Credentials from the Database.",
    skip(user_id, credentials, pool)
)]
pub async fn create_user_from_credentials(
    user_id: &Uuid,
    credentials: &UsersRegistrationInput,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<UserInfo, AppError> {
    let params = argon2::Params::new(15000, 2, 1, None)
        .context("Failed to set Argon2 Params.")
        .map_err(AppError::UnexpectedError)?;
    let hasher = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
    let salt = SaltString::generate(rand::thread_rng());

    let hashed_password = hasher
        .hash_password(credentials.password.expose_secret().as_bytes(), &salt)
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

    pool.execute(query)
        .await
        .context("Failed to Insert user credentials from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(UserInfo {
        id: user_id.to_owned(),
        username: credentials.username.to_owned(),
    })
}

#[tracing::instrument(
    name = "Verifying Credentials from the database.",
    skip(credentials, pool)
)]
pub async fn validate_user_credentials(
    credentials: &Credentials,
    pool: &PgPool,
) -> Result<UserInfo, AppError> {
    let row = sqlx::query!(
        r#"SELECT * FROM users WHERE username = $1"#,
        credentials.username
    )
    .fetch_optional(pool)
    .await
    .context("Failed to fetch user from the database.")
    .map_err(AppError::UnexpectedError)?;

    let (id, username, password) = match row {
        Some(data) => (data.id, data.username, data.password),
        None => {
            return Err(AppError::UnauthorizedError(anyhow::anyhow!(
                "Invalid Username."
            )))
        }
    };

    let phc_password = PasswordHash::new(&password)
        .context("Failed to parse password into PHC Format.")
        .map_err(AppError::UnauthorizedError)?;

    Argon2::default()
        .verify_password(
            credentials.password.expose_secret().as_bytes(),
            &phc_password,
        )
        .context("Invalid Password.")
        .map_err(AppError::UnauthorizedError)?;

    Ok(UserInfo { id, username })
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

    let row = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch user from the database.")
        .map_err(AppError::UnexpectedError)?;

    match row {
        Some(_) => (),
        None => {
            return Err(AppError::UnauthorizedError(anyhow::anyhow!(
                "Invalid Username."
            )))
        }
    };

    Ok(())
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
    .await
    .context("Failed to fetch user from the database.")
    .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => (),
        None => {
            return Err(AppError::NotFoundError(anyhow::anyhow!(
                "Username was not found."
            )))
        }
    };

    Ok(())
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
    .await
    .context("Failed to fetch user from the database.")
    .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => (),
        None => {
            return Err(AppError::NotFoundError(anyhow::anyhow!(
                "User was not found."
            )))
        }
    };

    Ok(())
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
    .await
    .context("Failed to fetch user from the database.")
    .map_err(AppError::UnexpectedError)?;

    match result {
        Some(data) => Ok(data),
        None => {
            return Err(AppError::UnauthorizedError(anyhow::anyhow!(
                "User was not found."
            )))
        }
    }
}
