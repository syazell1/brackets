use argon2::{Argon2, PasswordHash, PasswordVerifier};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{domains::Credentials, errors::AppError};

#[tracing::instrument(
    name = "Verifying Credentials from the database.",
    skip(credentials, pool)
)]
pub async fn validate_user_credentials(
    credentials: &Credentials,
    pool: &PgPool,
) -> Result<Uuid, AppError> {
    let row = sqlx::query!(
        r#"SELECT id, password FROM users WHERE username = $1"#,
        credentials.username
    )
    .fetch_optional(pool)
    .await?;

    let (id, password) = match row {
        Some(data) => (data.id, data.password),
        None => return Err(AppError::UnauthorizedError("User was not found.".into())),
    };

    let phc_string = PasswordHash::new(&password)
        .map_err(|_| AppError::UnauthorizedError("Password was not in PHC format.".into()))?;

    Argon2::default()
        .verify_password(credentials.password.as_bytes(), &phc_string)
        .map_err(|_| AppError::UnauthorizedError("Invalid Password.".into()))?;

    Ok(id)
}
