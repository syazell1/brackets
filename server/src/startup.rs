use std::{net::SocketAddr, sync::Arc};

use axum::{
    http::{HeaderValue, Method},
    routing::get,
    serve::Serve,
    Router,
};
use rand::{distributions::Alphanumeric, Rng};
use reqwest::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use sqlx::{postgres::PgPoolOptions, PgPool};
use tokio::net::TcpListener;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::{
    app_state::AppState,
    configuration::{DatabaseSettings, JwtSettings, Settings},
    routes::{auth_routes, comment_routes, follow_routes, health_check, post_routes, users_routes},
};

pub struct Application {
    port: u16,
    address : SocketAddr,
    server: Serve<Router, Router>,
}

impl Application {
    pub async fn build(config: Settings) -> Result<Self, std::io::Error> {
        let address = TcpListener::bind(format!("{}:{}", config.app.host, config.app.port))
            .await
            .expect("Failed to bind address.");

        let pool = get_db_pool(&config.database).await;
        let url = address.local_addr().unwrap();
        let port = address.local_addr().unwrap().port();
        
        let server = axum::serve(
            address,
            get_app_routes(config.app.client_url, pool, config.jwt),
        );

        Ok(Self { port, server, address : url})
    }

    pub fn get_port(&self) -> u16 {
        self.port
    }

    pub async fn run_until_stopped(self) -> Result<(), std::io::Error> {
        tracing::info!("Server Started at : {}", self.address);
        self.server.await
    }
}

pub fn get_app_routes(client_url: String, pool: PgPool, jwt_settings: JwtSettings) -> Router {
    let app_state = Arc::new(AppState { pool, jwt_settings });

    Router::new()
        .nest(
            "/api",
            Router::new()
                .route("/health_check", get(health_check))
                .nest("/auth", auth_routes())
                .nest("/posts", post_routes())
                .nest("/users", follow_routes())
                .nest("/users", users_routes())
                .nest("/comments", comment_routes()),
        )
        .layer(
            CorsLayer::new()
                .allow_methods([
                    Method::GET,
                    Method::POST,
                    Method::PATCH,
                    Method::DELETE,
                    Method::OPTIONS,
                ])
                .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE])
                .allow_credentials(true)
                .allow_origin(client_url.parse::<HeaderValue>().unwrap()),
        )
        .layer(TraceLayer::new_for_http())
        .with_state(app_state)
}

pub async fn get_db_pool(config: &DatabaseSettings) -> PgPool {
    PgPoolOptions::new().connect_lazy_with(config.with_db())
}

pub fn generate_random_chars(n: usize) -> String {
    rand::thread_rng()
        .sample_iter(Alphanumeric)
        .take(n)
        .map(char::from)
        .collect()
}
