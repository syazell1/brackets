use secrecy::ExposeSecret;
use server::startup::run;
use server::configuration::get_config;
use server::telemetry::{get_sub, init_sub};
use std::net::TcpListener;
use sqlx::PgPool;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let sub = get_sub("server", "info");
    init_sub(sub);

    let config = get_config()
        .expect("Failed to set configuration.");

    let connection = PgPool::connect(
        config.database.connection_string().expose_secret()
    )
    .await
    .expect("Failed to connect to the database.");

    let address = TcpListener::bind(
        format!("127.0.0.1:{}", config.app_port)
    )
    .expect("Failed to bind address.");

    run(
        address,
        connection,
        config.client_url,
        config.jwt
    )?.await 
}

