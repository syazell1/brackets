use actix_web::{get, patch, post, web, HttpResponse, Scope};
use anyhow::{anyhow, Context};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{
    app::{
        add_like_to_post, check_post_like, create_users_posts, get_all_posts, get_liked_posts,
        get_users_posts_by_username, manage_users_posts, remove_like_to_post, update_users_posts,
        verify_posts_by_id, verify_user_by_username, verify_users_posts_by_id,
    },
    errors::AppAPIError,
    models::{PageFilters, PostLikeIds, PostStatusPath, PostsInput},
    utils::{filter_app_err, AuthToken},
};

use super::get_posts_comments;

pub fn posts_scope() -> Scope {
    web::scope("/posts")
        .service(create_posts)
        .service(update_posts)
        .service(manage_posts)
        .service(fetch_posts_by_username)
        .service(fetch_all_posts)
        .service(get_posts_comments)
        .service(like_post)
        .service(unlike_post)
        .service(fetch_posts_like_status)
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

    verify_users_posts_by_id(&post_id, &auth_token.id, &mut transaction)
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
        .map_err(AppAPIError::BadRequestError)?;

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

    verify_users_posts_by_id(&post_status.id, &auth_token.id, &mut transaction)
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

#[get("")]
#[tracing::instrument(name = "Fetching ALl Posts", skip(page_filters, pool))]
async fn fetch_all_posts(
    page_filters: web::Query<PageFilters>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let result = get_all_posts(
        page_filters.page.unwrap_or(1),
        page_filters.page_size.unwrap_or(10),
        &pool,
    )
    .await
    .map_err(filter_app_err)?;

    Ok(HttpResponse::Ok().json(result))
}

#[post("/{id}/like")]
#[tracing::instrument(name = "Liking a post", skip(auth_token, id, pool))]
async fn like_post(
    auth_token: AuthToken,
    id: web::Path<String>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let mut transaction = pool
        .begin()
        .await
        .context("Failed to initialize SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_posts_by_id(&id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    if (check_post_like(&id, &auth_token.id, &mut transaction).await).is_ok() {
        return Err(AppAPIError::BadRequestError(anyhow!(
            "Post was already liked"
        )));
    };

    add_like_to_post(&id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to commit SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::Ok().finish())
}

#[post("/{id}/unlike")]
#[tracing::instrument(name = "Unlike a post", skip(auth_token, id, pool))]
async fn unlike_post(
    auth_token: AuthToken,
    id: web::Path<String>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let mut transaction = pool
        .begin()
        .await
        .context("Failed to initialize SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_posts_by_id(&id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    check_post_like(&id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    remove_like_to_post(&id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to commit SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::Ok().finish())
}

#[post("/check-likes")]
#[tracing::instrument(name = "Fetching posts like status", skip(posts, auth_token, pool))]
async fn fetch_posts_like_status(
    posts: web::Json<PostLikeIds>,
    auth_token: AuthToken,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let result = get_liked_posts(&posts, &auth_token.id, &pool)
        .await
        .map_err(filter_app_err)?;

    Ok(HttpResponse::Ok().json(result))
}
