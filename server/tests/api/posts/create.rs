use fake::{faker::lorem::en::{Sentence, Paragraph}, Fake};
use serde_json::json;
use server::{models::PostsInput, routes::AuthResponse};

use crate::helpers::{spawn_app, TestUser};

#[tokio::test]
async fn an_authenticated_user_should_create_a_post() {
    // Arrange
    let app = spawn_app().await;
    let test_user = TestUser::generate();
    test_user.store(&app.pool).await;

    // Act
    let res = app.post_login_user(json!(test_user.credentials))
        .await
        .json::<AuthResponse>()
        .await
        .expect("Failed to parse auth response");

    let post = PostsInput {
        title : Paragraph(1..12).fake(),
        content : Sentence(1..12).fake()
    };

    let res = app.http_client.post(format!("{}/posts", &app.address)) 
        .bearer_auth(res.access_token)
        .json(&post)
        .send()
        .await
        .expect("Failed to send post request.");

    // Assert
    assert_eq!(201, res.status().as_u16());

    let a = sqlx::query!(
        r#"
            SELECT title, content FROM posts WHERE title = $1 AND content = $2   
        "#,
        post.title,
        post.content
    )
    .fetch_one(&app.pool)
    .await
    .expect("Failed to fetch post");

    assert_eq!(a.title, post.title);
    assert_eq!(a.content, post.content);
}