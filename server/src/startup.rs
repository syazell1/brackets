use actix_web::{web, HttpServer, App, dev::Server};
use actix_cors::Cors;
use tracing_actix_web::TracingLogger;
use std::net::TcpListener;
use sqlx::PgPool;

use crate::{routes::{health_check, auth_scope}, configuration::JwtSettings};

pub fn run (
    lst : TcpListener,
    connection : PgPool,
    client_url : String,
    jwt_settings : JwtSettings
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
            )
            .app_data(connection.clone())
            .app_data(jwt_settings.clone())
    })
    .listen(lst)?
    .run();

    Ok(server)
}