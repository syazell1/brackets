use axum::{http::StatusCode, response::IntoResponse, Json};
use validator::ValidationErrors;

#[derive(serde::Serialize)]
pub struct ErrorResponse<'a> {
    pub error_type: &'a str,
    pub status_code: u16,
    pub message: &'a str,
}

#[derive(thiserror::Error)]
pub enum AppError {
    #[error("{0}")]
    NotFoundError(String),
    #[error("{0}")]
    BadRequestError(#[source] anyhow::Error),
    #[error("{0}")]
    ValidationError(#[from] ValidationErrors),
    #[error("{0}")]
    UnauthorizedError(String),
    #[error("{0}")]
    DbError(#[from] sqlx::Error),
    #[error("{0}")]
    UnexpectedError(#[from] anyhow::Error),
}

impl std::fmt::Debug for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{0}", self)
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        match self {
            AppError::NotFoundError(e) => (
                StatusCode::NOT_FOUND,
                Json(ErrorResponse {
                    status_code: StatusCode::NOT_FOUND.as_u16(),
                    message: &e,
                    error_type: "NotFoundError",
                }),
            )
                .into_response(),
            AppError::BadRequestError(e) => (
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    status_code: StatusCode::BAD_REQUEST.as_u16(),
                    message: &e.to_string(),
                    error_type: "BadRequestError",
                }),
            )
                .into_response(),
            AppError::ValidationError(_) => (
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    status_code: StatusCode::BAD_REQUEST.as_u16(),
                    message: "Validation Error",
                    error_type: "ValidationError",
                }),
            )
                .into_response(),
            AppError::UnauthorizedError(e) => (
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    status_code: StatusCode::UNAUTHORIZED.as_u16(),
                    message: &e.to_string(),
                    error_type: "UnauthorizedError",
                }),
            )
                .into_response(),
            AppError::DbError(e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    status_code: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
                    message: &e.to_string(),
                    error_type: "DbError",
                }),
            )
                .into_response(),
            AppError::UnexpectedError(e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    status_code: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
                    message: &e.to_string(),
                    error_type: "UnexpectedError",
                }),
            )
                .into_response(),
        }
    }
}
