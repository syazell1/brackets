use chrono::{DateTime, Utc};
use uuid::Uuid;

use super::UserInfo;

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
    pub likes_count: i64,
    pub comments_count: i64,
    pub owner: UserInfo,
}

#[derive(serde::Deserialize)]
pub struct PostStatusPath {
    pub id: String,
    pub command: String,
}

#[derive(serde::Deserialize)]
pub struct PostLikeIds {
    pub post_ids: Vec<Uuid>,
}

#[derive(serde::Serialize)]
pub struct PostLikeStatus {
    pub is_liked: bool,
    pub post_id: Uuid,
}

impl PostLikeStatus {
    pub fn new(is_liked: bool, post_id: Uuid) -> Self {
        Self { is_liked, post_id }
    }
}
