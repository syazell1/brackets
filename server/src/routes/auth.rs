use std::sync::Arc;

use anyhow::Context;
use axum::{
    extract::State,
    http::StatusCode,
    response::{AppendHeaders, IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use axum_extra::{headers, TypedHeader};
use cookie::{time::Duration, Cookie, CookieBuilder};
use reqwest::header::SET_COOKIE;
use serde::Deserialize;
use uuid::{NoContext, Timestamp, Uuid};

use crate::{
    app_state::AppState, configuration::JwtSettings, errors::AppError, models::{CredentialsFormData, RegisterFormData}, persistence::{create_user_from_credentials, create_users_info, get_user_by_id, validate_user_credentials}, utils::{decode_jwt, generate_jwt, AuthToken}
};

#[derive(serde::Serialize, Deserialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub id: Uuid,
    pub username: String,
}

pub fn auth_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/login", post(login_user))
        .route("/register", post(register_user))
        .route("/refresh", get(refresh_user_token))
        .route("/logout", post(logout_user))
        .route("/current-user", get(get_current_user))
}

#[tracing::instrument(name = "Registering User", skip(input, app_state))]
async fn register_user(
    State(app_state): State<Arc<AppState>>,
    Json(input): Json<RegisterFormData>,
) -> Result<Response, AppError> {
    let credentials = input.credentials.try_into()?;
    let info = input.info.try_into()?;

    let mut tx = app_state.pool.begin().await?;

    let id = Uuid::new_v7(Timestamp::now(NoContext));
    create_user_from_credentials(&id, &credentials, &mut tx).await?;
    create_users_info(&id, &info, &mut tx).await?;
    tx.commit().await?;

    let (at, rt) = get_auth_tokens(id, &app_state.jwt_settings)?;

    Ok((
        StatusCode::OK,
        AppendHeaders([(SET_COOKIE, rt.to_string())]),
        Json(AuthResponse {
            id,
            username: credentials.username,
            access_token: at,
        }),
    )
        .into_response())
}

#[tracing::instrument(name = "Logging User In", skip(credentials, app_state))]
async fn login_user(
    State(app_state): State<Arc<AppState>>,
    Json(credentials): Json<CredentialsFormData>,
) -> Result<Response, AppError> {
    let credentials = credentials.try_into()?;
    let id = validate_user_credentials(&credentials, &app_state.pool).await?;

    let (at, rt) = get_auth_tokens(id, &app_state.jwt_settings)?;

    Ok((
        StatusCode::OK,
        AppendHeaders([(SET_COOKIE, rt.to_string())]),
        Json(AuthResponse {
            access_token: at,
            id,
            username: credentials.username,
        }),
    )
        .into_response())
}

#[tracing::instrument(name = "Refreshing User token.", skip(app_state, cookie))]
async fn refresh_user_token(
    State(app_state): State<Arc<AppState>>,
    TypedHeader(cookie): TypedHeader<headers::Cookie>,
) -> Result<Response, AppError> {
    let rt = match cookie.get("rt") {
        Some(data) => data.to_string(),
        None => {
            return Err(AppError::UnauthorizedError(
                "Refresh Token was not found.".into(),
            ))
        }
    };

    let token_data = decode_jwt(&rt, &app_state.jwt_settings)
        .map_err(|e| AppError::UnauthorizedError(e.to_string()))?;

    let user = get_user_by_id(&token_data.claims.id, &app_state.pool).await?;

    let (at, rt) = get_auth_tokens(user.id, &app_state.jwt_settings)?;

    Ok((
        StatusCode::OK,
        AppendHeaders([(SET_COOKIE, rt.to_string())]),
        Json(AuthResponse {
            access_token: at,
            id: user.id,
            username: user.username,
        }),
    )
        .into_response())
}

#[tracing::instrument(name = "Logging out user", skip(cookie))]
async fn logout_user(
    TypedHeader(cookie): TypedHeader<headers::Cookie>,
) -> Result<Response, AppError> {
    let token = match cookie.get("rt") {
        Some(data) => data,
        None => {
            return Err(AppError::UnauthorizedError(
                "Refresh Token was not found.".into(),
            ))
        }
    };

    let rt = Cookie::build(("rt", token))
        .path("/")
        .secure(true)
        .http_only(true)
        .same_site(cookie::SameSite::Lax)
        .max_age(Duration::ZERO)
        .build();

    Ok((
        StatusCode::OK,
        AppendHeaders([(SET_COOKIE, rt.to_string())]),
    )
        .into_response())
}

#[tracing::instrument(
    name = "Getting current authenticated user info",
    skip(auth_token, app_state)
)]
async fn get_current_user(
    auth_token: AuthToken,
    State(app_state): State<Arc<AppState>>,
) -> Result<Response, AppError> {
    let user = get_user_by_id(&auth_token.id, &app_state.pool).await?;

    Ok((StatusCode::OK, Json(user)).into_response())
}

fn get_auth_tokens(
    user_id: Uuid,
    jwt_settings: &JwtSettings,
) -> Result<(String, Cookie), AppError> {
    let (at, rt) = generate_jwt(user_id, jwt_settings)
        .context("Failed to generate JWT")
        .map_err(AppError::UnexpectedError)?;

    let cookie = CookieBuilder::new("rt", rt)
        .http_only(true)
        .same_site(cookie::SameSite::Lax)
        .path("/")
        .secure(true)
        .max_age(Duration::days(7))
        .build();

    Ok((at, cookie))
}
