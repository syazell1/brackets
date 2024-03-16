use tracing::Subscriber;
use tracing_bunyan_formatter::{BunyanFormattingLayer, JsonStorageLayer};
use tracing_log::LogTracer;
use tracing_subscriber::{EnvFilter, Registry, layer::SubscriberExt};

pub fn get_sub(name : &str, env_info : &str) -> impl Subscriber + Send + Sync {
    let env_filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new(env_info));

    let formatting_layer = BunyanFormattingLayer::new(
        name.to_string(),
        std::io::stdout
    );

    Registry::default()
        .with(env_filter)
        .with(formatting_layer)
        .with(JsonStorageLayer)
}

pub fn init_sub(sub : impl Subscriber + Send + Sync) {
    LogTracer::init()
        .expect("Failed to set logger.");

    tracing::subscriber::set_global_default(sub)
        .expect("Failed to set subscriber.");
}