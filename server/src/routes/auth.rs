use actix_web::{Scope, web, HttpResponse, cookie::{CookieBuilder, time::Duration}, post, HttpRequest, get};
use anyhow::Context;
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{errors::AppAPIError, models::{UsersRegistrationInput, Credentials}, app::{create_user_from_credentials, create_users_info, validate_user_credentials, validate_user_by_id}, utils::{filter_app_err, generate_jwt, decode_jwt}, configuration::JwtSettings};

#[derive(serde::Serialize)]
pub struct AuthResponse {
    pub access_token : String
}

pub fn auth_scope() -> Scope {
    web::scope("/auth")
        .service(register_user)
        .service(login_user)
        .service(refresh_user_token)
        .service(logout_user)
}

#[post("/register")]
#[tracing::instrument(
    name = "Registering User",
    skip(register_input, pool, jwt_settings)
)]
async fn register_user(
    register_input : web::Json<UsersRegistrationInput>,
    pool : web::Data<PgPool>,
    jwt_settings : web::Data<JwtSettings>
) -> Result<HttpResponse, AppAPIError> {
    let id = Uuid::new_v4();

    register_input.0.validate()
        .map_err(AppAPIError::ValidationErrors)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to begin transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    create_user_from_credentials(&id, &register_input, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    create_users_info(&id, &register_input, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    let (at, rt) = generate_jwt(&id.to_string(), &jwt_settings)
        .context("Failed to gennerate JWT")
        .map_err(AppAPIError::UnexpectedError)?;

    let cookie = CookieBuilder::new("rt", rt)
        .http_only(true)
        .same_site(actix_web::cookie::SameSite::Lax)
        .path("/")
        .secure(true)
        .max_age(Duration::days(7))
        .finish();

    Ok(
        HttpResponse::Ok().cookie(cookie).json(AuthResponse {
            access_token : at
        })
    )
}

#[post("/login")]
#[tracing::instrument(
    name = "Logging User In",
    skip(credentials, pool, jwt_settings)
)]
async fn login_user(
    credentials : web::Json<Credentials>,
    pool : web::Data<PgPool>,
    jwt_settings : web::Data<JwtSettings>,
) -> Result<HttpResponse, AppAPIError> {

    credentials.0.validate()
        .map_err(AppAPIError::ValidationErrors)?;


    let user_id = validate_user_credentials(&credentials.0, &pool)
        .await
        .map_err(filter_app_err)?;

    let (at, rt) = generate_jwt(&user_id.to_string(), &jwt_settings)
        .context("Failed to gennerate JWT")
        .map_err(AppAPIError::UnexpectedError)?;

    let cookie = CookieBuilder::new("rt", rt)
        .http_only(true)
        .same_site(actix_web::cookie::SameSite::Lax)
        .path("/")
        .secure(true)
        .max_age(Duration::days(7))
        .finish();

    Ok(
        HttpResponse::Ok().cookie(cookie).json(AuthResponse {
            access_token : at
        })
    )
}

#[get("/refresh")]
#[tracing::instrument(
    name = "Refreshing User token.",
    skip(req, pool, jwt_settings)
)]
async fn refresh_user_token(
    req : HttpRequest,
    pool : web::Data<PgPool>,
    jwt_settings : web::Data<JwtSettings>
) -> Result<HttpResponse, AppAPIError> {
    let req = req.clone();

    let token = req.cookie("rt")
        .context("Cookie not found.")
        .map_err(AppAPIError::UnexpectedError)?;

    let token_data = decode_jwt(token.value(), &jwt_settings)
        .map_err(filter_app_err)?;
    let id = Uuid::try_parse(token_data.claims.id.as_str())
        .context("Invalid user id.")
        .map_err(AppAPIError::UnauthorizedError)?;

    let mut transaction = pool
        .begin()
        .await
        .context("Failed to begin transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    validate_user_by_id(&id, &mut transaction)
        .await
        .map_err(filter_app_err)?;

    transaction
        .commit()
        .await
        .context("Failed to execute SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    let (at, rt) = generate_jwt(&id.to_string(), &jwt_settings)
        .context("Failed to gennerate JWT")
        .map_err(AppAPIError::UnexpectedError)?;

    let cookie = CookieBuilder::new("rt", rt)
        .http_only(true)
        .same_site(actix_web::cookie::SameSite::Lax)
        .path("/")
        .secure(true)
        .max_age(Duration::days(7))
        .finish();

    Ok(
        HttpResponse::Ok().cookie(cookie).json(AuthResponse {
            access_token : at
        })
    )
}

#[post("/logout")]
#[tracing::instrument(
    name = "Logging out user",
    skip(req)
)]
async fn logout_user(
    req : HttpRequest
) -> Result<HttpResponse, AppAPIError> {
    let mut cookie= req.cookie("rt")
        .context("Cookie was not found.")
        .map_err(AppAPIError::UnauthorizedError)?;

    cookie.make_removal();

    let cookie = CookieBuilder::new("rt", cookie.value())
        .http_only(true)
        .same_site(actix_web::cookie::SameSite::Lax)
        .secure(true)
        .path("/")
        .max_age(
            cookie.max_age()
                .context("Failed to parse the Max Age of the previous Cookie.")
                .map_err(AppAPIError::UnexpectedError)?
        )
        .finish();

    Ok(
        HttpResponse::Ok().cookie(cookie).finish()
    )
}