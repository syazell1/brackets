use std::sync::Arc;

use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts},
    http::request::Parts,
    RequestPartsExt,
};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header as JwtHeader, TokenData};
use uuid::Uuid;

use crate::{app_state::AppState, configuration::JwtSettings, errors::AppError};

#[derive(serde::Deserialize, serde::Serialize)]
pub struct Claims {
    pub iss: String,
    pub aud: String,
    pub exp: usize,
    pub id: Uuid,
}

fn generate_token(
    id: Uuid,
    jwt_settings: &JwtSettings,
    is_refresh_token: bool,
) -> Result<String, jsonwebtoken::errors::Error> {
    let claims = Claims {
        iss: jwt_settings.issuer.to_string(),
        aud: jwt_settings.audience.to_string(),
        id,
        exp: if is_refresh_token {
            (Utc::now() + Duration::try_days(7).unwrap()).timestamp() as usize
        } else {
            (Utc::now() + Duration::try_minutes(15).unwrap()).timestamp() as usize
        },
    };

    encode(
        &JwtHeader::default(),
        &claims,
        &EncodingKey::from_secret(jwt_settings.secret_key.as_bytes()),
    )
}

pub fn decode_jwt(
    token: &str,
    jwt_settings: &JwtSettings,
) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
    let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS256);
    validation.set_issuer(&[jwt_settings.issuer.to_string()]);
    validation.set_audience(&[jwt_settings.audience.to_string()]);

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_settings.secret_key.as_bytes()),
        &validation,
    )
}

pub fn generate_jwt(
    id: Uuid,
    jwt_settings: &JwtSettings,
) -> Result<(String, String), jsonwebtoken::errors::Error> {
    let at = generate_token(id, jwt_settings, false)?;
    let rt = generate_token(id, jwt_settings, true)?;

    Ok((at, rt))
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct AuthToken {
    pub id: Uuid,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthToken
where
    S: Send + Sync,
    Arc<AppState>: FromRef<S>,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| AppError::UnauthorizedError("Token was not found.".into()))?;

        let app_state = Arc::from_ref(state);

        let token_data = decode_jwt(bearer.token(), &app_state.jwt_settings)
            .map_err(|e| AppError::UnauthorizedError(e.to_string()))?;

        Ok(Self {
            id: token_data.claims.id,
        })
    }
}
