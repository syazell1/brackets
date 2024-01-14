use actix_web::{get, patch, post, web, HttpResponse, Scope};
use anyhow::Context;
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{
    app::{
        create_users_posts, get_users_posts_by_username, manage_users_posts, update_users_posts,
        verify_user_by_username, verify_users_posts_by_id,
    },
    errors::AppAPIError,
    models::{PageFilters, PostStatusPath, PostsInput},
    utils::{filter_app_err, AuthToken},
};

pub fn posts_scope() -> Scope {
    web::scope("/posts")
        .service(create_posts)
        .service(update_posts)
        .service(manage_posts)
        .service(fetch_posts_by_username)
}

#[post("")]
#[tracing::instrument(name = "Adding Posts", skip(auth_token, posts, pool))]
async fn create_posts(
    auth_token: AuthToken,
    posts: web::Json<PostsInput>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    posts.0.validate().map_err(AppAPIError::ValidationErrors)?;

    create_users_posts(&auth_token.id, &posts, &pool)
        .await
        .map_err(filter_app_err)?;

    Ok(HttpResponse::Created().finish())
}

#[patch("/{id}")]
#[tracing::instrument(name = "Updating Posts", skip(post_id, auth_token, posts, pool))]
async fn update_posts(
    post_id: web::Path<String>,
    auth_token: AuthToken,
    posts: web::Json<PostsInput>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let id = Uuid::try_parse(&post_id)
        .context("Invalid Id.")
        .map_err(AppAPIError::NotFoundError)?;

    posts.0.validate().map_err(AppAPIError::ValidationErrors)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to initialize SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_users_posts_by_id(&id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    update_users_posts(&id, &auth_token.id, &posts.0, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::NoContent().finish())
}

#[patch("/{id}/{command}")]
#[tracing::instrument(name = "Updating Post Status", skip(post_status, auth_token, pool))]
async fn manage_posts(
    post_status: web::Path<PostStatusPath>,
    auth_token: AuthToken,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let id = Uuid::try_parse(&post_status.id)
        .context("Invalid Id.")
        .map_err(AppAPIError::NotFoundError)?;

    let is_delete = if post_status.command.to_lowercase().eq("delete") {
        true
    } else if post_status.command.to_lowercase().eq("restore") {
        false
    } else {
        return Err(AppAPIError::BadRequestError(anyhow::anyhow!(
            "Invalid Command."
        )));
    };

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to initialize SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_users_posts_by_id(&id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    manage_users_posts(is_delete, &id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transactions.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::NoContent().finish())
}

#[get("/{username}")]
#[tracing::instrument(name = "Fetching Posts", skip(username, page_filters, pool))]
async fn fetch_posts_by_username(
    username: web::Path<String>,
    page_filters: web::Query<PageFilters>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    verify_user_by_username(&username, &pool)
        .await
        .map_err(filter_app_err)?;

    let result = get_users_posts_by_username(
        &username,
        page_filters.page.unwrap_or(1),
        page_filters.page_size.unwrap_or(10),
        &pool,
    )
    .await
    .map_err(filter_app_err)?;

    Ok(HttpResponse::Ok().json(result))
}
