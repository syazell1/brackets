use anyhow::Context;
use uuid::Uuid;

use crate::errors::AppError;

pub fn uuid_parser(id: &str) -> Result<Uuid, AppError> {
    let id = Uuid::try_parse(id)
        .context("Failed to parse to uuid, Invalid Id.")
        .map_err(AppError::BadRequestError)?;

    Ok(id)
}
