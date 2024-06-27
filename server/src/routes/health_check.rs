use axum::{http::StatusCode, response::IntoResponse};

#[tracing::instrument(name = "Checking Endpoint")]
pub async fn health_check() -> impl IntoResponse {
    (StatusCode::OK).into_response()
}
