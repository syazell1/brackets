use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(serde::Deserialize, validator::Validate)]
pub struct CommentInput {
    pub content: String,
    pub post_id: String,
}

#[derive(serde::Serialize)]
pub struct CommentData {
    pub id: Uuid,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub owner: CommentOwner,
}

#[derive(serde::Serialize, sqlx::Type)]
pub struct CommentOwner {
    pub id: Uuid,
    pub username: String,
}
