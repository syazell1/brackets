use anyhow::Context;
use sqlx::{types::BitVec, Executor, PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::{
    domains::Post, errors::AppError, models::{PageList, PostDataWithContent, PostPageFilters, PostsData, UserInfo, UsersPostFilters}
};

#[tracing::instrument(name = "Adding Users Posts from the database", skip(user_id, post, pool))]
pub async fn create_users_post(
    user_id: &Uuid,
    post: &Post,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let is_deleted = BitVec::from_elem(1, post.is_deleted);

    let query = sqlx::query!(
        r#"
            INSERT INTO posts(id, title, content, owner_id, is_deleted, created_at)
            VALUES
            ($1, $2, $3, $4, $5, now())
        "#,
        post.id,
        post.title,
        post.content,
        user_id,
        is_deleted
    );

    pool.execute(query).await?;

    Ok(())
}

#[tracing::instrument(name = "Updating Users Posts from the database", skip(user_id, post, tx))]
pub async fn update_users_posts(
    user_id: &Uuid,
    post: &Post,
    tx: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
    let query = sqlx::query!(
        r#"
            UPDATE posts SET title = $1, content = $2, updated_at = now()
            WHERE id = $3 AND owner_id = $4
        "#,
        post.title,
        post.content,
        post.id,
        user_id
    );

    tx.execute(query)
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
    post_id: Uuid,
    user_id: Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
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
        Some(_) => Ok(()),
        None => Err(AppError::NotFoundError("Post was not found.".into())),
    }
}

#[tracing::instrument(name = "Verifying Posts from the database", skip(post_id, pool))]
pub async fn verify_posts_by_id(
    post_id: Uuid,
    pool: &mut Transaction<'_, Postgres>,
) -> Result<(), AppError> {
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
        None => Err(AppError::NotFoundError("Post was not found.".into())),
    }
}

#[tracing::instrument(
    name = "Fetching Users Posts from the database",
    skip(username, page_filters, pool)
)]
pub async fn get_users_posts_by_username(
    username: &str,
    page_filters : &UsersPostFilters,
    pool: &PgPool,
) -> Result<PageList<Vec<PostsData>>, AppError> {
    let current_page = page_filters.page.unwrap_or(1);
    let page_size = page_filters.page_size.unwrap_or(10);

    let page = page_size * (current_page - 1);

    let result = sqlx::query_as!(
        PostsData,
        r#"
            SELECT p.id, p.title, p.created_at, p.is_deleted,
            (u.id, u.username) "owner!: UserInfo",
            (SELECT COUNT(id) FROM like_posts lp WHERE lp.post_id = p.id) "likes_count!: i64",
            (SELECT COUNT(id) FROM comments c WHERE c.post_id = p.id) "comments_count!: i64" 
            FROM posts p
            INNER JOIN users u ON u.id = p.owner_id
            WHERE is_deleted = '0' AND username = $1
            ORDER BY created_at DESC
            OFFSET $2
            LIMIT $3
        "#,
        username,
        page as i32,
        page_size as i32
    )
    .fetch_all(pool)
    .await?;

    let total_items_count = sqlx::query_scalar!(
        r#"
        SELECT COUNT(p.id) FROM posts p
        INNER JOIN users u on u.id = p.owner_id
        WHERE u.username = $1
        "#,
        username
    )
    .fetch_one(pool)
    .await?;

    let page_result = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(page_result)
}

// TODO:
// add a checker to get post by id
// if post is deleted, show 400
// if post is deleted and user who doesnt created that post views it, show 400
// remove is_delete_filter below here
//      much better if this query filter is only used for user's posts only
#[tracing::instrument(
    name = "Fetching All Posts from the database",
    skip(page_filters, pool)
)]
pub async fn get_all_posts(
    page_filters: &PostPageFilters,
    pool: &PgPool,
) -> Result<PageList<Vec<PostsData>>, AppError> {
    let current_page = page_filters.page.unwrap_or(1);
    let page_size = page_filters.page_size.unwrap_or(10);
    let search_filter = &page_filters.search;
    // let mut is_deleted = BitVec::from_elem(1, false);

    let search = match search_filter {
        Some(data) => format!("%{}%", data),
        None => "%%".to_string(),
    };

    let page = page_size * (current_page - 1);

    let result = sqlx::query_as!(
        PostsData,
        r#"
            SELECT * FROM (
                SELECT p.id, p.title, p.created_at, p.is_deleted,
                (u.id, u.username) "owner!: UserInfo",
                (SELECT COUNT(id) FROM like_posts lp WHERE lp.post_id = p.id) "likes_count!: i64",
                (SELECT COUNT(id) FROM comments c WHERE c.post_id = p.id) "comments_count!: i64" 
                FROM posts p
                INNER JOIN users u ON u.id = p.owner_id
                WHERE title LIKE $1 OR content LIKE $1
            )
            WHERE is_deleted = '0'
            ORDER BY created_at DESC
            OFFSET $2
            LIMIT $3
        "#,
        search,
        page as i32,
        page_size as i32
    )
    .fetch_all(pool)
    .await?;

    let total_items_count = sqlx::query_scalar!(
        r#"
        SELECT COUNT(p.id) FROM posts p
        INNER JOIN users u on u.id = p.owner_id
        WHERE  is_deleted = '0'
        "#,
    )
    .fetch_one(pool)
    .await?;

    let page_result = PageList::new(
        result,
        current_page,
        page_size,
        total_items_count.unwrap_or(0) as u32,
    );

    Ok(page_result)
}

#[tracing::instrument(name = "Fetching Post from the database", skip(post_id, pool))]
pub async fn get_post_by_id(post_id: &Uuid, pool: &PgPool) -> Result<PostDataWithContent, AppError> {
    let row = sqlx::query_as!(
        PostDataWithContent,
        r#"
            SELECT p.id, p.title, p.content, p.created_at,
            (u.id, u.username) "owner!: UserInfo",
            (SELECT COUNT(id) FROM like_posts lp WHERE lp.post_id = p.id) "likes_count!: i64",
            (SELECT COUNT(id) FROM comments c WHERE c.post_id = p.id) "comments_count!: i64" 
            FROM posts p
            INNER JOIN users u ON u.id = p.owner_id
            WHERE p.id = $1 
        "#,
        post_id
    )
    .fetch_optional(pool)
    .await?;

    match row {
        Some(data) => Ok(data),
        None => Err(AppError::NotFoundError(format!(
            "Post with Id '{0}' was not found",
            post_id
        ))),
    }
}
