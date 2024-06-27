use std::sync::Arc;

// use actix_web::{delete, get, patch, post, web, HttpResponse, Scope};
use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{delete, patch, post},
    Json, Router,
};
use validator::Validate;

use crate::{
    app_state::AppState,
    errors::AppError,
    models::{CommentInput, CommentLikeIds},
    persistence::{
        add_comments_to_post, add_like_to_comment, check_comment_like, delete_comments_by_id,
        get_liked_comments, remove_like_to_comment, update_comments_by_id, verify_comments_by_id,
        verify_comments_by_user_id, verify_posts_by_id,
    },
    utils::{uuid_parser, AuthToken},
};

pub fn comment_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", post(add_comment))
        .route("/:id", patch(update_comment))
        .route("/:id", delete(delete_comment))
        .route("/:id/like", post(like_comment))
        .route("/:id/unlike", post(unlike_comment))
        .route("/check-likes", post(fetch_comments_like_status))
}

// pub fn posts_comments_scope() -> Scope {
//     web::scope("/posts").service(add_comments)
// }
// #[post("")]
#[tracing::instrument(name = "Adding Comments", skip(auth_token, comment, app_state))]
pub async fn add_comment(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Json(comment): Json<CommentInput>,
) -> Result<Response, AppError> {
    comment.validate()?;
    let post_id = uuid_parser(&comment.post_id)?;
    let mut tx = app_state.pool.begin().await?;

    verify_posts_by_id(post_id, &mut tx).await?;

    add_comments_to_post(&comment, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::CREATED).into_response())
}

// #[patch("/{id}")]
#[tracing::instrument(name = "Updating Comment", skip(auth_token, id, comment, app_state))]
pub async fn update_comment(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(comment): Json<CommentInput>,
) -> Result<Response, AppError> {
    comment.validate()?;

    let comment_id = uuid_parser(&id)?;
    let post_id = uuid_parser(&comment.post_id)?;

    let mut tx = app_state.pool.begin().await?;

    verify_posts_by_id(post_id, &mut tx).await?;

    verify_comments_by_user_id(comment_id, auth_token.id, &mut tx).await?;

    update_comments_by_id(&comment_id, &comment, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::NO_CONTENT).into_response())
}

// #[delete("/{id}")]
#[tracing::instrument(name = "Deleting Comments", skip(auth_token, comment_id, app_state))]
pub async fn delete_comment(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    comment_id: Path<String>,
) -> Result<Response, AppError> {
    let comment_id = uuid_parser(&comment_id)?;

    let mut tx = app_state.pool.begin().await?;

    verify_comments_by_user_id(comment_id, auth_token.id, &mut tx).await?;

    delete_comments_by_id(&comment_id, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[post("/{id}/like")]
#[tracing::instrument(name = "Liking a comment", skip(auth_token, id, app_state))]
async fn like_comment(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let mut tx = app_state.pool.begin().await?;

    verify_comments_by_id(&id, &mut tx).await?;

    if (check_comment_like(&id, &auth_token.id, &mut tx).await).is_ok() {
        return Err(AppError::BadRequestError(anyhow!(
            "Comment was already liked"
        )));
    };

    add_like_to_comment(&id, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[post("/{id}/unlike")]
#[tracing::instrument(name = "Unlike a comment", skip(auth_token, id, app_state))]
async fn unlike_comment(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Response, AppError> {
    let mut tx = app_state.pool.begin().await?;

    verify_comments_by_id(&id, &mut tx).await?;

    check_comment_like(&id, &auth_token.id, &mut tx).await?;

    remove_like_to_comment(&id, &auth_token.id, &mut tx).await?;

    tx.commit().await?;

    Ok((StatusCode::OK).into_response())
}

// #[post("/check-likes")]
#[tracing::instrument(
    name = "Fetching comments like status",
    skip(comments, auth_token, app_state)
)]
async fn fetch_comments_like_status(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
    Json(comments): Json<CommentLikeIds>,
) -> Result<Response, AppError> {
    let result = get_liked_comments(&comments, &auth_token.id, &app_state.pool).await?;

    Ok((StatusCode::OK, Json(result)).into_response())
}
