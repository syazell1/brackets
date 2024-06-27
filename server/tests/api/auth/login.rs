use claims::assert_ok;
use serde_json::json;
use server::{
    routes::AuthResponse, startup::generate_random_chars
};

use crate::helpers::{spawn_app, TestUser};

#[tokio::test]
async fn a_valid_credentials_is_accepted() {
    // Arrange
    let app = spawn_app().await;
    let test_user = TestUser::generate();
    test_user.store(&app.pool).await;

    // Act
    let res = app.post_login_user(&json!(test_user.credentials)).await;
    let is_refresh_token = res.headers().get("set-cookie").is_some();

    // Assert
    assert_eq!(200, res.status().as_u16());
    assert_ok!(res.json::<AuthResponse>().await);
    assert_eq!(true, is_refresh_token);
}

#[tokio::test]
async fn an_invalid_credentials_is_rejected() {
    // Arrange
    let app = spawn_app().await;
    let mut test_user = TestUser::generate();
    test_user.store(&app.pool).await;

    for i in 1..2 {
        if i == 1 {
            test_user.credentials.username = generate_random_chars(12)
        }
        if i == 2 {
            test_user.credentials.password = generate_random_chars(12)
        }

        // Act
        let res = app.post_login_user(&json!(test_user.credentials)).await;

        // Assert
        assert_eq!(401, res.status().as_u16());
    }
}

#[tokio::test]
pub async fn missing_field_would_return_422() {
    // Arrange
    let app = spawn_app().await;
    let credentials = vec![
        json!({"username": generate_random_chars(12)}),
        json!({"password": generate_random_chars(12)}),
        json!({}),
    ];

    for c in &credentials {
        // Act
        let res = app.post_login_user(&c).await;

        // Assert
        assert_eq!(422, res.status().as_u16());
    }
}

#[tokio::test]
pub async fn login_returns_400_when_credentials_are_present_but_invalid() {
    // Arrange
    let app = spawn_app().await;
    let credentials = vec![
        json!({"username": generate_random_chars(24), "password": generate_random_chars(12)}),
        json!({"username": generate_random_chars(12), "password": generate_random_chars(24)}),
        json!({"username": "", "password": generate_random_chars(12)}),
        json!({"username": generate_random_chars(12), "password": ""}),
    ];

    for c in &credentials {
        // Act
        let res = app.post_login_user(c).await;

        // Assert
        assert_eq!(400, res.status().as_u16());
    }
}
