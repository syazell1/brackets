use std::sync::Arc;

use anyhow::{anyhow, Context};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, patch, post},
    Json, Router,
};
use uuid::Uuid;
use validator::Validate;

use crate::{
    app_state::AppState, domains::{Post, UpdatePostTo}, errors::AppError, models::{PageFilters, PostLikeIds, PostPageFilters, PostStatusPath, PostsInput}, persistence::{
        add_like_to_post, check_post_like, create_users_post, fetch_posts_comments, get_all_posts, get_liked_posts, get_post_by_id, manage_users_posts, remove_like_to_post, update_users_posts, verify_posts_by_id, verify_user_by_id_tx, verify_users_posts_by_id
    }, utils::{uuid_parser, AuthToken}
};

pub fn post_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", post(create_post))
        .route("/:id", patch(update_post))
        .route("/:id/:command", patch(manage_post))
        .route("/", get(fetch_all_posts))
        .route("/:id", get(fetch_post_by_id))
        .route("/:id/like", post(like_post))
        .route("/:id/unlike", post(unlike_post))
        .route("/check-likes", post(fetch_posts_like_status))
        .route("/:id/comments", get(get_posts_comments))
}

#[tracing::instrument(name = "Adding Post", skip(auth_token, app_state, post))]
async fn create_post(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Json(post): Json<PostsInput>,
) -> Result<Response, AppError> {
    let post : Post = post.try_into()?;
    post.validate()?;
    let mut tx = app_state.pool.begin().await?;
    verify_user_by_id_tx(auth_token.id, &mut tx).await?;
    create_users_post(&auth_token.id, &post, &mut tx).await?;
    tx.commit().await?;

    Ok((StatusCode::CREATED).into_response())
}

#[tracing::instrument(name = "Updating Posts", skip(id, auth_token, app_state, post))]
async fn update_post(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(post): Json<PostsInput>,
) -> Result<Response, AppError> {
    let id = uuid_parser(&id)?;

    let post = post.try_update_into(&id)?;
    
    let mut tx = app_state.pool.begin().await?;

    verify_users_posts_by_id(post.id, auth_token.id, &mut tx).await?;

    update_users_posts(&auth_token.id, &post, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::NO_CONTENT).into_response())
}

// #[patch("/{id}/{command}")]
#[tracing::instrument(
    name = "Updating Post Status",
    skip(auth_token, app_state, post_status)
)]
async fn manage_post(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(post_status): Path<PostStatusPath>,
) -> Result<Response, AppError> {
    let id = Uuid::try_parse(&post_status.id)
        .context("Invalid Id.")
        .map_err(AppError::BadRequestError)?;

    let is_delete = if post_status.command.to_lowercase().eq("delete") {
        true
    } else if post_status.command.to_lowercase().eq("restore") {
        false
    } else {
        return Err(AppError::BadRequestError(anyhow::anyhow!(
            "Invalid Command."
        )));
    };

    let mut tx = app_state.pool.begin().await?;

    verify_users_posts_by_id(id, auth_token.id, &mut tx).await?;

    manage_users_posts(is_delete, &id, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::NO_CONTENT).into_response())
}

// #[get("")]
#[tracing::instrument(name = "Fetching All Posts", skip(page_filters, app_state))]
async fn fetch_all_posts(
    State(app_state): State<Arc<AppState>>,
    Query(page_filters): Query<PostPageFilters>,
) -> Result<Response, AppError> {
    let result = get_all_posts(&page_filters, &app_state.pool).await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}

// #[get("/{id}")]
#[tracing::instrument(name = "Fetching Post By Id", skip(id, app_state))]
async fn fetch_post_by_id(
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let post_id = uuid_parser(&id)?;

    let result = get_post_by_id(&post_id, &app_state.pool).await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}

// #[post("/{id}/like")]
#[tracing::instrument(name = "Liking a post", skip(auth_token, id, app_state))]
async fn like_post(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let post_id = uuid_parser(&id)?;

    let mut tx = app_state.pool.begin().await?;

    verify_posts_by_id(post_id, &mut tx).await?;

    if (check_post_like(post_id, auth_token.id, &mut tx).await).is_ok() {
        return Err(AppError::BadRequestError(anyhow!("Post was already liked")));
    };

    add_like_to_post(&id, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[post("/{id}/unlike")]
#[tracing::instrument(name = "Unlike a post", skip(auth_token, id, app_state))]
async fn unlike_post(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let post_id = uuid_parser(&id)?;

    let mut tx = app_state.pool.begin().await?;

    verify_posts_by_id(post_id, &mut tx).await?;

    check_post_like(post_id, auth_token.id, &mut tx).await?;

    remove_like_to_post(&id, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[post("/check-likes")]
#[tracing::instrument(name = "Fetching post like status", skip(posts, auth_token, app_state))]
async fn fetch_posts_like_status(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Json(posts): Json<PostLikeIds>,
) -> Result<Response, AppError> {
    let result = get_liked_posts(&posts, &auth_token.id, &app_state.pool).await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}

// #[get("/{id}/comments")]
#[tracing::instrument(name = "Fetchign Post's Comments", skip(id, page_filters, app_state))]
pub async fn get_posts_comments(
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Query(page_filters): Query<PageFilters>,
) -> Result<Response, AppError> {
    let post_id = uuid_parser(&id)?;
    let mut tx = app_state.pool.begin().await?;

    verify_posts_by_id(post_id, &mut tx).await?;

    tx.commit().await?;

    let result = fetch_posts_comments(
        post_id,
        page_filters.page.unwrap_or(1),
        page_filters.page_size.unwrap_or(10),
        &app_state.pool,
    )
    .await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}
