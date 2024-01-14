use actix_cors::Cors;
use actix_web::{dev::Server, web, App, HttpServer};
use sqlx::PgPool;
use std::net::TcpListener;
use tracing_actix_web::TracingLogger;

use crate::{
    configuration::JwtSettings,
    routes::{auth_scope, health_check, posts_scope},
};

pub fn run(
    lst: TcpListener,
    connection: PgPool,
    client_url: String,
    jwt_settings: JwtSettings,
) -> Result<Server, std::io::Error> {
    let connection = web::Data::new(connection);
    let jwt_settings = web::Data::new(jwt_settings);

    let server = HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_header()
            .allow_any_method()
            .allowed_origin(&client_url)
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(TracingLogger::default())
            .wrap(cors)
            .service(
                web::scope("/api")
                    .route("/health_check", web::get().to(health_check))
                    .service(auth_scope())
                    .service(posts_scope()),
            )
            .app_data(connection.clone())
            .app_data(jwt_settings.clone())
    })
    .listen(lst)?
    .run();

    Ok(server)
}

