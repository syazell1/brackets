use anyhow::Context;
use chrono::Utc;
use sqlx::{types::BitVec, Executor, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    errors::AppError,
    models::{PageList, PostOwner, PostsData, PostsInput},
    utils::uuid_parser,
};

#[tracing::instrument(name = "Adding Users Posts from the database", skip())]
pub async fn create_users_posts(
    user_id: &Uuid,
    posts: &PostsInput,
    pool: &PgPool,
) -> Result<(), AppError> {
    let id = Uuid::new_v4();
    let date = Utc::now();

    sqlx::query!(
        r#"
            INSERT INTO posts(id, title, content, owner_id, created_at, is_deleted)
            VALUES
            ($1, $2, $3, $4, $5, '0')
        "#,
        id,
        posts.title,
        posts.content,
        user_id,
        date
    )
    .execute(pool)
    .await
    .context("Failed to insert posts from the database.")
    .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Updating Users Posts from the database", skip())]
pub async fn update_users_posts(
    post_id: &Uuid,
    user_id: &Uuid,
    posts: &PostsInput,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            UPDATE posts SET title = $1, content = $2, updated_at = $3
            WHERE id = $4 AND owner_id = $5
        "#,
        posts.title,
        posts.content,
        Utc::now(),
        post_id,
        user_id
    );

    pool.execute(query)
        .await
        .context("Failed to update posts from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Updating Users Posts Status from the database", skip())]
pub async fn manage_users_posts(
    is_delete: bool,
    post_id: &Uuid,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    // A way to convert boolean to BIT Type in PGSQL
    // Since you can't pass a normal i8 type or bool type
    let mut bv = BitVec::from_elem(1, false);
    bv.set(0, is_delete);

    let query = sqlx::query!(
        r#"UPDATE posts SET is_deleted = $1 WHERE id = $2 AND owner_id = $3"#,
        bv,
        post_id,
        user_id
    );

    pool.execute(query)
        .await
        .context("Failed to delete posts from the database.")
        .map_err(AppError::UnexpectedError)?;

    Ok(())
}

#[tracing::instrument(name = "Verifying Users Posts from the database", skip())]
pub async fn verify_users_posts_by_id(
    post_id: &str,
    user_id: &Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let post_id = Uuid::try_parse(post_id)
        .context("Invalid Post Id.")
        .map_err(AppError::BadRequestError)?;

    let query = sqlx::query!(
        r#"
            SELECT id FROM posts WHERE id = $1 AND owner_id = $2
        "#,
        post_id,
        user_id
    );

    let result = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch posts from the database.")
        .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => (),
        None => {
            return Err(AppError::NotFoundError(anyhow::anyhow!(
                "Post was not found."
            )))
        }
    }
    Ok(())
}

#[tracing::instrument(name = "Verifying Posts from the database", skip(post_id, pool))]
pub async fn verify_posts_by_id(
    post_id: &str,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let post_id = uuid_parser(post_id)?;

    let query = sqlx::query!(
        r#"
            SELECT id FROM posts WHERE id = $1
        "#,
        post_id
    );

    let result = pool
        .fetch_optional(query)
        .await
        .context("Failed to fetch post from the database.")
        .map_err(AppError::UnexpectedError)?;

    match result {
        Some(_) => Ok(()),
        None => {
            return Err(AppError::NotFoundError(anyhow::anyhow!(
                "Post was not found."
            )))
        }
    }
}

#[tracing::instrument(
    name = "Fetching Users Posts from the database",
    skip(username, current_page, page_size, pool)
)]
pub async fn get_users_posts_by_username(
    username: &str,
    current_page: u32,
    page_size: u32,
    pool: &PgPool,
) -> Result<PageList<Vec<PostsData>>, AppError> {
    let page = page_size * (current_page - 1);

    let result = sqlx::query_as!(
        PostsData,
        r#"
            SELECT p.id, p.title, p.content, p.created_at,
            (u.id, u.username) "owner!: PostOwner",
            (SELECT COUNT(id) FROM like_posts lp WHERE lp.post_id = p.id) "likes_count!: i64",
            (SELECT COUNT(id) FROM comments c WHERE c.post_id = p.id) "comments_count!: i64"
            FROM posts p
            INNER JOIN users u ON u.id = p.owner_id
            WHERE u.username = $1
            ORDER BY created_at DESC 
            OFFSET $2
            LIMIT $3
        "#,
        username,
        page as i32,
        page_size as i32
    )
    .fetch_all(pool)
    .await
    .context("Failed to fetch posts from the database.")
    .map_err(AppError::UnexpectedError)?;

    let total_items_count = sqlx::query_scalar!(
        r#"
        SELECT COUNT(p.id) FROM posts p
        INNER JOIN users u on u.id = p.owner_id
        WHERE u.username = $1
        "#,
        username
    )
    .fetch_one(pool)
    .await
    .context("Failed to fetch users posts count from the database.")
    .map_err(AppError::UnexpectedError)?;

    let page_result = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(page_result)
}

#[tracing::instrument(
    name = "Fetching All Posts from the database",
    skip(current_page, page_size, pool)
)]
pub async fn get_all_posts(
    current_page: u32,
    page_size: u32,
    pool: &PgPool,
) -> Result<PageList<Vec<PostsData>>, AppError> {
    let page = page_size * (current_page - 1);

    let result = sqlx::query_as!(
        PostsData,
        r#"
            SELECT p.id, p.title, p.content, p.created_at,
            (u.id, u.username) "owner!: PostOwner",
            (SELECT COUNT(id) FROM like_posts lp WHERE lp.post_id = p.id) "likes_count!: i64",
            (SELECT COUNT(id) FROM comments c WHERE c.post_id = p.id) "comments_count!: i64" 
            FROM posts p
            INNER JOIN users u ON u.id = p.owner_id
            ORDER BY created_at DESC 
            OFFSET $1
            LIMIT $2
        "#,
        page as i32,
        page_size as i32
    )
    .fetch_all(pool)
    .await
    .context("Failed to fetch posts from the database.")
    .map_err(AppError::UnexpectedError)?;

    let total_items_count = sqlx::query_scalar!(
        r#"
        SELECT COUNT(p.id) FROM posts p
        INNER JOIN users u on u.id = p.owner_id
        "#
    )
    .fetch_one(pool)
    .await
    .context("Failed to fetch posts count from the database.")
    .map_err(AppError::UnexpectedError)?;

    let page_result = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(page_result)
}
