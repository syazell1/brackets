use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use validator::ValidationErrors;

use crate::models::ErrorResponse;

#[derive(thiserror::Error)]
pub enum AppError {
    #[error("{0}")]
    NotFoundError(#[source] anyhow::Error),
    #[error("{0}")]
    BadRequestError(#[source] anyhow::Error),
    #[error("{0}")]
    UnauthorizedError(#[source] anyhow::Error),
    #[error("{0}")]
    UnexpectedError(#[source] anyhow::Error),
}

impl std::fmt::Debug for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{0}", self)
    }
}

#[derive(thiserror::Error)]
pub enum AppAPIError {
    #[error("{0}")]
    NotFoundError(#[source] anyhow::Error),
    #[error("{0}")]
    BadRequestError(#[source] anyhow::Error),
    #[error("{0}")]
    ValidationErrors(#[from] ValidationErrors),
    #[error("{0}")]
    UnauthorizedError(#[source] anyhow::Error),
    #[error("{0}")]
    UnexpectedError(#[source] anyhow::Error),
}

impl std::fmt::Debug for AppAPIError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{0}", self)
    }
}

impl ResponseError for AppAPIError {
    fn error_response(&self) -> actix_web::HttpResponse<actix_web::body::BoxBody> {
        match self {
            AppAPIError::NotFoundError(e) => HttpResponse::NotFound().json(ErrorResponse {
                error_type: "NotFoundError".to_string(),
                status_code: StatusCode::NOT_FOUND.as_u16(),
                details: e.to_string(),
            }),
            AppAPIError::BadRequestError(e) => HttpResponse::BadRequest().json(ErrorResponse {
                error_type: "BadRequestError".to_string(),
                status_code: StatusCode::BAD_REQUEST.as_u16(),
                details: e.to_string(),
            }),
            AppAPIError::ValidationErrors(_) => HttpResponse::BadRequest().json(ErrorResponse {
                error_type: "ValidationErrors".to_string(),
                status_code: StatusCode::UNAUTHORIZED.as_u16(),
                details: "Invalid Filds".to_string(),
            }),
            AppAPIError::UnauthorizedError(e) => HttpResponse::Unauthorized().json(ErrorResponse {
                error_type: "UnauthorizedError".to_string(),
                status_code: StatusCode::UNAUTHORIZED.as_u16(),
                details: e.to_string(),
            }),
            AppAPIError::UnexpectedError(e) => {
                HttpResponse::InternalServerError().json(ErrorResponse {
                    error_type: "UnexpectedError".to_string(),
                    status_code: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
                    details: e.root_cause().to_string(),
                })
            }
        }
    }
}
