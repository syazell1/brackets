use server::configuration::get_config;
use server::startup::Application;
use server::telemetry::{get_sub, init_sub};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let sub = get_sub("server", "info", std::io::stdout);
    init_sub(sub);

    let config = get_config().expect("Failed to set configuration.");
    let app = Application::build(config).await?;
    app.run_until_stopped().await?;

    Ok(())
}
