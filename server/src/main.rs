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

    let connection = PgPool::connect_lazy_with(
        config.database.with_db()
    );

    let address = TcpListener::bind(
        format!("{}:{}", config.app.host, config.app.port)
    )
    .expect("Failed to bind address.");

    run(
        address,
        connection,
        config.app.client_url,
        config.jwt
    )?.await 
}

