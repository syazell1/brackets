use std::future::{ready, Ready};

use actix_web::{http::header::Header, FromRequest, web};
use actix_web_httpauth::headers::authorization;
use anyhow::Context;
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header as JwtHeader, TokenData, decode, DecodingKey};
use uuid::Uuid;

use crate::{configuration::JwtSettings, errors::{AppAPIError, AppError}};

#[derive(serde::Deserialize, serde::Serialize)]
pub struct Claims {
    pub iss: String,
    pub aud: String,
    pub exp: usize,
    pub id: String,
}

fn generate_token(
    id: &str,
    jwt_settings: &JwtSettings,
    is_refresh_token: bool,
) -> Result<String, jsonwebtoken::errors::Error> {
    let claims = Claims {
        iss: jwt_settings.issuer.to_string(),
        aud: jwt_settings.audience.to_string(),
        id: id.to_string(),
        exp: if is_refresh_token {
            (Utc::now() + Duration::days(7)).timestamp() as usize
        } else {
            (Utc::now() + Duration::minutes(12)).timestamp() as usize
        },
    };

    encode(
        &JwtHeader::default(),
        &claims,
        &EncodingKey::from_secret(jwt_settings.secret_key.as_bytes()),
    )
}

pub fn decode_jwt(
    token : &str,
    jwt_settings: &JwtSettings
) -> Result<TokenData<Claims>, AppError> {
    let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS256);
    validation.set_issuer(&[jwt_settings.issuer.to_string()]);
    validation.set_audience(&[jwt_settings.audience.to_string()]);

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_settings.secret_key.as_bytes()),
        &validation
    )
    .context("Failed to decode jwt token")
    .map_err(AppError::UnauthorizedError)?;

    Ok(token_data)
}

pub fn generate_jwt(
    id: &str,
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

impl FromRequest for AuthToken {
    type Error = AppAPIError;
    type Future = Ready<Result<Self, AppAPIError>>;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_web::dev::Payload,
    ) -> Self::Future {
        let req = req.clone();

        let bearer = match authorization::Authorization::<authorization::Bearer>::parse(&req) {
            Ok(data) => data.into_scheme(),
            Err(_) => {
                return ready(Err(AppAPIError::UnexpectedError(anyhow::anyhow!(
                    "No Token Found"
                ))))
            }
        };

        let jwt_settings = match req.app_data::<web::Data<JwtSettings>>() {
            Some(data) => data,
            None => {
                return ready(Err(AppAPIError::UnexpectedError(anyhow::anyhow!(
                    "Unable to fetch jwt settings."
                ))))
            } 
        };

        match decode_jwt(bearer.token(), jwt_settings) {
            Ok(data) => {
                let id = match Uuid::try_parse(&data.claims.id) {
                    Ok(data) => data,
                    Err(_) => {
                        return ready(Err(AppAPIError::UnauthorizedError(anyhow::anyhow!("Invalid Id."))));
                    }
                };

                ready(Ok(AuthToken { id}))

            },
            Err(_) => ready(Err(AppAPIError::UnauthorizedError(anyhow::anyhow!("Invalid Access Token."))))
        }
    }
}
