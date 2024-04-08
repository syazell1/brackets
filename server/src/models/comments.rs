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
    pub likes_count: i64,
    pub post_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub owner: CommentOwner,
}

#[derive(serde::Serialize, sqlx::Type)]
pub struct CommentOwner {
    pub id: Uuid,
    pub username: String,
}

#[derive(serde::Deserialize)]
pub struct CommentLikeIds {
    pub comment_ids: Vec<Uuid>,
}

#[derive(serde::Serialize)]
pub struct CommentLikeStatus {
    pub is_liked: bool,
    pub comment_id: Uuid,
}

impl CommentLikeStatus {
    pub fn new(is_liked: bool, comment_id: Uuid) -> Self {
        Self {
            is_liked,
            comment_id,
        }
    }
}
