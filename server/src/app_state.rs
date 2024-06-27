use sqlx::PgPool;

use crate::configuration::JwtSettings;

pub struct AppState {
    pub pool: PgPool,
    pub jwt_settings: JwtSettings,
}
