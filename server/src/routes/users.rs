use actix_web::{get, web, HttpResponse, Scope};
use sqlx::PgPool;

use crate::{
    app::{get_users_posts_by_username, verify_user_by_username},
    errors::AppAPIError,
    models::PageFilters,
    utils::filter_app_err,
};

pub fn users_scope() -> Scope {
    web::scope("/users").service(fetch_posts_by_username)
}

#[get("/{username}/posts")]
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
