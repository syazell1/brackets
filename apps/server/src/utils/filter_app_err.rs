use crate::errors::{AppAPIError, AppError};

pub fn filter_app_err(app_err: AppError) -> AppAPIError {
    match app_err {
        AppError::NotFoundError(e) => AppAPIError::NotFoundError(e),
        AppError::BadRequestError(e) => AppAPIError::BadRequestError(e),
        AppError::UnauthorizedError(e) => AppAPIError::UnauthorizedError(e),
        AppError::UnexpectedError(e) => AppAPIError::UnexpectedError(e),
    }
}
