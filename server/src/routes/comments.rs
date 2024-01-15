use actix_web::{delete, get, patch, post, web, HttpResponse, Scope};
use anyhow::Context;
use sqlx::PgPool;
use validator::Validate;

use crate::{
    app::{
        add_comments_to_post, delete_comments_by_id, fetch_posts_comments, update_comments_by_id,
        verify_comments_by_id, verify_posts_by_id, verify_users_posts_by_id,
    },
    errors::AppAPIError,
    models::{CommentInput, PageFilters},
    utils::{filter_app_err, uuid_parser, AuthToken},
};

pub fn comments_scope() -> Scope {
    web::scope("/comments")
        .service(add_comments)
        .service(delete_comments)
        .service(update_comments)
}

pub fn posts_comments_scope() -> Scope {
    web::scope("/posts").service(add_comments)
}
#[post("")]
#[tracing::instrument(name = "Adding Comments", skip(auth_token, comment, pool))]
pub async fn add_comments(
    auth_token: AuthToken,
    comment: web::Json<CommentInput>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    comment
        .0
        .validate()
        .map_err(AppAPIError::ValidationErrors)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to Initialize SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_users_posts_by_id(&comment.post_id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    add_comments_to_post(&comment.0, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::Created().finish())
}

#[patch("/{id}")]
#[tracing::instrument(
    name = "Updating Comments",
    skip(auth_token, comment_id, comment, pool)
)]
pub async fn update_comments(
    auth_token: AuthToken,
    comment_id: web::Path<String>,
    comment: web::Json<CommentInput>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    comment
        .0
        .validate()
        .map_err(AppAPIError::ValidationErrors)?;

    let comment_id = uuid_parser(&comment_id).map_err(filter_app_err)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to Initialize SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_users_posts_by_id(&comment.post_id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    verify_comments_by_id(&comment_id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    update_comments_by_id(&comment_id, &comment, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::NoContent().finish())
}

#[delete("/{id}")]
#[tracing::instrument(name = "Deleting Comments", skip(auth_token, comment_id, pool))]
pub async fn delete_comments(
    auth_token: AuthToken,
    comment_id: web::Path<String>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let comment_id = uuid_parser(&comment_id).map_err(filter_app_err)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to Initialize SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_comments_by_id(&comment_id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    delete_comments_by_id(&comment_id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::NoContent().finish())
}

#[get("/{id}/comments")]
#[tracing::instrument(name = "Deleting Comments", skip(post_id, page_filters, pool))]
pub async fn get_posts_comments(
    post_id: web::Path<String>,
    page_filters: web::Query<PageFilters>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let mut transaction = pool
        .begin()
        .await
        .context("Failed to Initialize SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_posts_by_id(&post_id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    let result = fetch_posts_comments(
        &post_id,
        page_filters.page.unwrap_or(1),
        page_filters.page_size.unwrap_or(10),
        &pool,
    )
    .await
    .map_err(filter_app_err)?;

    Ok(HttpResponse::Ok().json(result))
}
