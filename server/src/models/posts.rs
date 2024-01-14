use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(serde::Deserialize, validator::Validate, Debug)]
pub struct PostsInput {
    #[validate(length(min = 4))]
    pub title: String,
    pub content: String,
}

#[derive(serde::Serialize)]
pub struct PostsData {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub owner: PostOwner,
}

#[derive(serde::Serialize, sqlx::Type)]
pub struct PostOwner {
    pub id: Uuid,
    pub username: String,
}

#[derive(serde::Deserialize)]
pub struct PostStatusPath {
    pub id: String,
    pub command: String,
}
