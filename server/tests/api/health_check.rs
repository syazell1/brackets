use crate::helpers::spawn_app;

#[tokio::test]
async fn health_check_returns_200() {
    // Arrange
    let app = spawn_app().await;

    // Act
    let res = app
        .http_client
        .get(format!("{}/health_check", app.address))
        .send()
        .await
        .expect("Failed to send health_check request.");

    // Assert
    assert_eq!(200, res.status().as_u16());
}
