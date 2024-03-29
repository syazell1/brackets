use actix_web::{
    cookie::{time::Duration, Cookie, CookieBuilder},
    get, post, web, HttpRequest, HttpResponse, Scope,
};
use anyhow::Context;
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{
    app::{
        create_user, get_user_by_id, validate_user_by_id, validate_user_credentials
    },
    configuration::JwtSettings,
    errors::AppAPIError,
    models::{AuthInfo, UserCredentials, UsersRegistrationInput},
    utils::{decode_jwt, filter_app_err, generate_jwt, AuthToken},
};

#[derive(serde::Serialize)]
pub struct AuthResponse {
    pub access_token: String,
}

pub fn auth_scope() -> Scope {
    web::scope("/auth")
        .service(register_user)
        .service(login_user)
        .service(refresh_user_token)
        .service(logout_user)
        .service(get_current_user)
}

#[post("/register")]
#[tracing::instrument(name = "Registering User", skip(register_input, pool, jwt_settings))]
async fn register_user(
    register_input: web::Json<UsersRegistrationInput>,
    pool: web::Data<PgPool>,
    jwt_settings: web::Data<JwtSettings>,
) -> Result<HttpResponse, AppAPIError> {
    register_input.0.credentials 
        .validate()
        .map_err(AppAPIError::ValidationErrors)?;

    register_input.0.info
        .validate()
        .map_err(AppAPIError::ValidationErrors)?;

    let mut tx = pool
        .begin()
        .await
        .context("Failed to begin transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    let id = create_user(&register_input.0, &mut tx)
        .await
        .map_err(filter_app_err)?;

    tx 
        .commit()
        .await
        .context("Failed to execute SQL Transaction.")
        .map_err(AppAPIError::UnexpectedError)?;

    let (at, rt)= get_auth_tokens(id, &jwt_settings)?;

    Ok(HttpResponse::Ok().cookie(rt).json(AuthInfo {
        access_token: &at,
        id,
    }))
}

#[post("/login")]
#[tracing::instrument(name = "Logging User In", skip(credentials, pool, jwt_settings))]
async fn login_user(
    credentials: web::Json<UserCredentials>,
    pool: web::Data<PgPool>,
    jwt_settings: web::Data<JwtSettings>,
) -> Result<HttpResponse, AppAPIError> {
    credentials
        .0
        .validate()
        .map_err(AppAPIError::ValidationErrors)?;

    let user = validate_user_credentials(&credentials.0, &pool)
        .await
        .map_err(filter_app_err)?;


    let (at, rt)= get_auth_tokens(user.id, &jwt_settings)?;


    Ok(HttpResponse::Ok().cookie(rt).json(AuthInfo {
        access_token: &at,
        id : user.id,
    }))
}

#[get("/refresh")]
#[tracing::instrument(name = "Refreshing User token.", skip(req, pool, jwt_settings))]
async fn refresh_user_token(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    jwt_settings: web::Data<JwtSettings>,
) -> Result<HttpResponse, AppAPIError> {
    let token = req
        .cookie("rt")
        .context("Cookie not found.")
        .map_err(AppAPIError::UnexpectedError)?;

    let token_data = decode_jwt(token.value(), &jwt_settings).map_err(filter_app_err)?;
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

    Ok(HttpResponse::Ok()
        .cookie(cookie)
        .json(AuthResponse { access_token: at }))
}

#[post("/logout")]
#[tracing::instrument(name = "Logging out user", skip(req))]
async fn logout_user(req: HttpRequest) -> Result<HttpResponse, AppAPIError> {
    let mut cookie = req
        .cookie("rt")
        .context("Cookie was not found.")
        .map_err(AppAPIError::UnauthorizedError)?;

    cookie.make_removal();

    let cookie = CookieBuilder::new("rt", cookie.value())
        .http_only(true)
        .same_site(actix_web::cookie::SameSite::Lax)
        .secure(true)
        .path("/")
        .max_age(
            cookie
                .max_age()
                .context("Failed to parse the Max Age of the previous Cookie.")
                .map_err(AppAPIError::UnexpectedError)?,
        )
        .finish();

    Ok(HttpResponse::Ok().cookie(cookie).finish())
}

#[get("/current_user")]
#[tracing::instrument(
    name = "Getting current authenticated user info",
    skip(auth_token, pool)
)]
async fn get_current_user(
    auth_token: AuthToken,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppAPIError> {
    let user = get_user_by_id(&auth_token.id, &pool)
        .await
        .map_err(filter_app_err)?;

    Ok(HttpResponse::Ok().json(user))
}

fn get_auth_tokens(
    user_id : Uuid,
    jwt_settings: &JwtSettings
) -> Result<(String, Cookie<'static>), AppAPIError>{
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

    Ok((at, cookie))
}