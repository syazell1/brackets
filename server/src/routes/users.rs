use std::sync::Arc;

use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use reqwest::StatusCode;

use crate::{
    app_state::AppState,
    errors::AppError,
    models::UsersPostFilters,
    persistence::{get_user_details_by_username, get_users_posts_by_username, verify_user_by_username},
};

pub fn users_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/:username/posts", get(fetch_posts_by_username))
        .route("/:username/details", get(fetch_user_details_by_username))
}

// #[get("/{username}/posts")]
#[tracing::instrument(name = "Fetching Posts", skip(username, page_filters, app_state))]
async fn fetch_posts_by_username(
    State(app_state): State<Arc<AppState>>,
    Path(username): Path<String>,
    Query(page_filters): Query<UsersPostFilters>,
) -> Result<Response, AppError> {
    verify_user_by_username(&username, &app_state.pool).await?;

    let result = get_users_posts_by_username(
        &username,
        &page_filters,
        &app_state.pool,
    )
    .await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}

#[tracing::instrument(name = "Fetching User Details", skip(username, app_state))]
async fn fetch_user_details_by_username(
    State(app_state): State<Arc<AppState>>,
    Path(username): Path<String>,
) -> Result<Response, AppError> {
    let user = get_user_details_by_username(&username, &app_state.pool).await?;

    Ok((StatusCode::OK, Json(user)).into_response())
}