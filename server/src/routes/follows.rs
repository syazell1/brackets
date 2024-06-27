use std::sync::Arc;

use anyhow::anyhow;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};

use crate::{
    app_state::AppState, errors::AppError, models::PageFilters, persistence::{
        follow_user, get_user_following_status, get_users_followers, get_users_followings, unfollow_user, verify_user_by_id, verify_user_by_id_tx, verify_user_follow_status
    }, utils::{uuid_parser, AuthToken}
};

pub fn follow_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/:id/follow", post(follow_user_by_id))
        .route("/:id/unfollow", post(unfollow_user_by_id))
        .route("/:id/followers", get(fetch_users_followers_by_id))
        .route("/:id/followings", get(fetch_users_followings_by_id))
        .route("/:id/status", get(fetch_user_follow_status))
}

// #[post("/{id}/follow")]
#[tracing::instrument(name = "Following a user", skip(id, auth_token, app_state))]
async fn follow_user_by_id(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let followee_id = uuid_parser(&id)?;

    if followee_id.eq(&auth_token.id) {
        return Err(AppError::BadRequestError(anyhow::anyhow!(
            "Follower Id cannot be the same as Followee Id."
        )));
    }

    let mut tx = app_state.pool.begin().await?;

    verify_user_by_id_tx(followee_id, &mut tx).await?;

    if (verify_user_follow_status(followee_id, auth_token.id, &mut tx).await).is_ok() {
        return Err(AppError::BadRequestError(anyhow!(
            "User already following this User with Id: {}",
            followee_id
        )));
    }

    follow_user(auth_token.id, followee_id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[post("/{id}/unfollow")]
#[tracing::instrument(name = "Unfollowing a user", skip(id, auth_token, app_state))]
async fn unfollow_user_by_id(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let followee_id = uuid_parser(&id)?;

    if followee_id.eq(&auth_token.id) {
        return Err(AppError::BadRequestError(anyhow::anyhow!(
            "Follower Id cannot be the same as Followee Id."
        )));
    }

    let mut tx = app_state.pool.begin().await?;

    verify_user_by_id_tx(followee_id, &mut tx).await?;

    verify_user_follow_status(followee_id, auth_token.id, &mut tx).await?;

    unfollow_user(auth_token.id, followee_id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[get("/{id}/followers")]
#[tracing::instrument(name = "Fetching users followers", skip(id, page_filters, app_state))]
async fn fetch_users_followers_by_id(
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Query(page_filters): Query<PageFilters>,
) -> Result<Response, AppError> {
    let followee_id = uuid_parser(&id)?;

    verify_user_by_id(&followee_id, &app_state.pool).await?;

    let result = get_users_followers(
        &followee_id,
        page_filters.page.unwrap_or(1),
        page_filters.page_size.unwrap_or(10),
        &app_state.pool,
    )
    .await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}

// #[get("/{id}/followings")]
#[tracing::instrument(name = "Fetching users followings", skip(id, page_filters, app_state))]
async fn fetch_users_followings_by_id(
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Query(page_filters): Query<PageFilters>,
) -> Result<Response, AppError> {
    let follower_id = uuid_parser(&id)?;

    verify_user_by_id(&follower_id, &app_state.pool).await?;

    let result = get_users_followings(
        &follower_id,
        page_filters.page.unwrap_or(1),
        page_filters.page_size.unwrap_or(10),
        &app_state.pool,
    )
    .await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}


#[derive(serde::Serialize)]
pub struct FollowingStatusResponse {
    is_following : bool
}
#[tracing::instrument(name = "Fetching user follow status", skip(auth, id, app_state))]
async fn fetch_user_follow_status(
    auth : AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError>{
    let id = uuid_parser(&id)?;

    let is_following = get_user_following_status(id, auth.id, &app_state.pool).await?;

    Ok((
        StatusCode::OK,
        Json(FollowingStatusResponse {
            is_following
        })
    ).into_response())
}