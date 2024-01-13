use secrecy::{Secret, ExposeSecret};

#[derive(serde::Deserialize)]
pub struct Settings {
    pub app_port : u16,
    pub client_url : String,
    pub jwt : JwtSettings,
    pub database : DatabaseSettings
}

#[derive(serde::Deserialize)]
pub struct JwtSettings {
    pub issuer : String,
    pub audience : String,
    pub secret_key : String
}

#[derive(serde::Deserialize)]
pub struct DatabaseSettings {
    pub username : String,
    pub password : Secret<String>,
    pub host : String,
    pub port : String,
    pub database_name : String
}

impl DatabaseSettings {
    pub fn connection_string(&self) -> Secret<String> {
        Secret::new(
            format!(
                "postgres://{}:{}@{}:{}/{}",
                self.username, self.password.expose_secret(), self.host, self.port, self.database_name
            )
        )
    }
}

pub fn get_config() -> Result<Settings, config::ConfigError> {
    let config = config::Config::builder()
        .add_source(config::File::with_name("configuration"))
        .build()?;

    config.try_deserialize()
}