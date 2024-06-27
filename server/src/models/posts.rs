use chrono::{DateTime, Utc};
use sqlx::types::BitVec;
use uuid::Uuid;
use validator::Validate;

use crate::{domains::{Post, UpdatePostTo}, errors::AppError};

use super::UserInfo;

#[derive(serde::Deserialize, serde::Serialize, Debug)]
pub struct PostsInput {
    pub title: String,
    pub content: String,
}

#[derive(serde::Serialize)]
pub struct PostsData {
    pub id: Uuid,
    pub title: String,
    pub created_at: DateTime<Utc>,
    pub likes_count: i64,
    pub comments_count: i64,
    #[serde(skip_serializing)]
    pub is_deleted: BitVec,
    pub owner: UserInfo,
}

#[derive(serde::Serialize)]
pub struct PostDataWithContent {
    pub id: Uuid,
    pub title: String,
    pub content : String,
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

impl UpdatePostTo for PostsInput {
    fn try_update_into(self, user_id : &Uuid) -> Result<Post, AppError> {
        let PostsInput {title, content} = self;
        let mut p = Post::create(title, content);
        p.id = *user_id;
        p.validate()?;
        Ok(p)
    }
}