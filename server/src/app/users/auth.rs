use anyhow::Context;
use argon2::Argon2;
use password_hash::{PasswordHasher, SaltString, PasswordHash, PasswordVerifier};
use secrecy::ExposeSecret;
use sqlx::{Transaction, Postgres, Executor, PgPool};
use uuid::Uuid;

use crate::{errors::AppError, models::{UsersRegistrationInput, Credentials}};

#[tracing::instrument(
    name = "Adding User Credentials from the Database.",
    skip(user_id, credentials, pool)
)]
pub async fn create_user_from_credentials(
    user_id : &Uuid,
    credentials : &UsersRegistrationInput,
    pool : &mut Transaction<'_, Postgres>
) -> Result<(), AppError> {
    let params = argon2::Params::new(15000, 2, 1, None)
        .context("Failed to set Argon2 Params.")
        .map_err(AppError::UnexpectedError)?;
    let hasher = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
    let salt = SaltString::generate(rand::thread_rng());

    let hashed_password = hasher.hash_password(
        credentials.password.expose_secret().as_bytes(), 
        &salt
    )
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

    pool
        .execute(query)
        .await
        .context("Failed to Insert user credentials from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(
    name = "Verifying Credentials from the database.",
    skip(credentials, pool)
)]
pub async fn validate_user_credentials(
    credentials : &Credentials,
    pool : &PgPool
) -> Result<Uuid, AppError> {
    let row = sqlx::query!(
        r#"SELECT * FROM users WHERE username = $1"#,
        credentials.username
    )
    .fetch_optional(pool)
    .await
    .context("Failed to fetch user from the database.")
    .map_err(AppError::UnexpectedError)?;

    let (id, password)= match row {
        Some(data) => (data.id, data.password), 
        None => return Err(AppError::UnauthorizedError(anyhow::anyhow!("Invalid Username."))) 
    };

    let phc_password = PasswordHash::new(&password)
        .context("Failed to parse password into PHC Format.")
        .map_err(AppError::UnauthorizedError)?;

    Argon2::default()
        .verify_password(credentials.password.expose_secret().as_bytes(), &phc_password)
        .context("Invalid Password.")
        .map_err(AppError::UnauthorizedError)?;

    Ok(id)
}

#[tracing::instrument(
    name = "Validating User from the Database" 
    skip(user_id, pool)
)]
pub async fn validate_user_by_id(
    user_id : &Uuid,
    pool : &mut Transaction<'_, Postgres>
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"SELECT COUNT(id) FROM users WHERE id = $1"#,
       user_id 
    );

    let row = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch user from the database.")
        .map_err(AppError::UnexpectedError)?;

    match row {
        Some(_) => (), 
        None => return Err(AppError::UnauthorizedError(anyhow::anyhow!("Invalid Username."))) 
    };

    Ok(())
}
