use actix_web::{get, post, web, HttpResponse, Scope};
use anyhow::{anyhow, Context};
use sqlx::PgPool;

use crate::{
    app::{follow_user, get_users_followers, verify_user_by_id, verify_user_follow_status},
    errors::AppAPIError,
    models::PageFilters,
    utils::{filter_app_err, uuid_parser, AuthToken},
};

pub fn follows_scope() -> Scope {
    web::scope("/users")
        .service(follow_user_by_id)
        .service(unfollow_user_by_id)
        .service(fetch_users_followers)
}

#[post("/{id}/follow")]
#[tracing::instrument(name = "Following a user", skip(id, auth_token, pool))]
async fn follow_user_by_id(
    id: web::Path<String>,
    auth_token: AuthToken,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let followee_id = uuid_parser(&id).map_err(filter_app_err)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to initialize SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_user_by_id(&followee_id, &pool)
        .await
        .map_err(filter_app_err)?;

    if (verify_user_follow_status(&followee_id, &auth_token.id, &mut transaction).await).is_ok() {
        return Err(AppAPIError::BadRequestError(anyhow!(
            "User already following this User with Id: {}",
            followee_id
        )));
    }

    follow_user(&auth_token.id, &followee_id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to commit SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::Ok().finish())
}

#[post("/{id}/unfollow")]
#[tracing::instrument(name = "Unfollowing a user", skip(id, auth_token, pool))]
async fn unfollow_user_by_id(
    id: web::Path<String>,
    auth_token: AuthToken,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let followee_id = uuid_parser(&id).map_err(filter_app_err)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to initialize SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    verify_user_by_id(&followee_id, &pool)
        .await
        .map_err(filter_app_err)?;

    verify_user_follow_status(&followee_id, &auth_token.id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    follow_user(&auth_token.id, &followee_id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to commit SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    Ok(HttpResponse::Ok().finish())
}

#[get("/{id}/followers")]
#[tracing::instrument(name = "Fetching users followers", skip(id, page_filters, pool))]
async fn fetch_users_followers(
    id: web::Path<String>,
    page_filters: web::Query<PageFilters>,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let followee_id = uuid_parser(&id).map_err(filter_app_err)?;

    verify_user_by_id(&followee_id, &pool)
        .await
        .map_err(filter_app_err)?;

    let result = get_users_followers(
        &followee_id,
        page_filters.page.unwrap_or_else(|| 1),
        page_filters.page_size.unwrap_or_else(|| 10),
        &pool,
    )
    .await
    .map_err(filter_app_err)?;

    Ok(HttpResponse::Ok().json(result))
}
