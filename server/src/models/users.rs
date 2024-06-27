use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(serde::Serialize, sqlx::Type)]
pub struct UserInfo {
    pub id: Uuid,
    pub username: String,
}

#[derive(serde::Serialize)]
pub struct UserDetails {
    pub id: Uuid,
    pub username: String,
    pub first_name : String,
    pub last_name : String,
    pub email : String,
    pub bio : Option<String>,
    pub created_at : DateTime<Utc> 
}