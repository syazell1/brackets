use actix_web::HttpResponse;

#[tracing::instrument(
    name = "Checking Endpoint"
)]
pub async fn health_check() -> HttpResponse {
    HttpResponse::Ok().finish()
}