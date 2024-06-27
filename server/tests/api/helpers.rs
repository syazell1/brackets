use fake::{
    faker::{
        internet::en::SafeEmail,
        lorem::en::Paragraph,
        name::en::{FirstName, LastName},
    },
    Fake,
};
use once_cell::sync::Lazy;
use server::{
    configuration::{get_config, DatabaseSettings}, domains::{Credentials, UserInformation}, persistence::{create_user_from_credentials, create_users_info}, startup::{generate_random_chars, get_db_pool, Application}, telemetry::{get_sub, init_sub}
};
use sqlx::{postgres::PgPoolOptions, Executor, PgPool};
use uuid::Uuid;

static TRACING: Lazy<()> = Lazy::new(|| {
    let app_name = "test";
    let log_level = "info";

    if std::env::var("TEST_LOG").is_ok() {
        let sub = get_sub(app_name, log_level, std::io::stdout);
        init_sub(sub);
    } else {
        let sub = get_sub(app_name, log_level, std::io::sink);
        init_sub(sub);
    }
});

pub struct TestApp {
    pub address: String,
    pub pool: PgPool,
    pub http_client: reqwest::Client
}

impl TestApp {
    pub async fn post_login_user<Body: serde::Serialize>(&self, body: Body) -> reqwest::Response {
        self.http_client
            .post(format!("{}/auth/login", self.address))
            .json(&body)
            .send()
            .await
            .expect("Failed to send login request.")
    }
}

pub async fn spawn_app() -> TestApp {
    Lazy::force(&TRACING);
    let config = {
        let mut config = get_config().expect("Failed to fetch configurations.");
        config.database.database_name = Uuid::new_v4().to_string();
        config.app.port = 0;
        config
    };

    configure_test_db(&config.database).await;
    let http_client = reqwest::Client::new();
    let pool = get_db_pool(&config.database).await;
    let app = Application::build(config.clone())
        .await
        .expect("Failed to build application.");
    let address = format!("http://localhost:{}/api", app.get_port());
    let _ = tokio::spawn(app.run_until_stopped());

    TestApp {
        pool,
        address,
        http_client
    }
}

async fn configure_test_db(config: &DatabaseSettings) {
    let pool = PgPoolOptions::new().connect_lazy_with(config.without_db());

    pool.execute(&*format!(r#"CREATE DATABASE "{}";"#, config.database_name))
        .await
        .expect("Failed to create database.");

    let pool = PgPoolOptions::new().connect_lazy_with(config.with_db());

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations.");
}

pub struct TestUser {
    pub credentials: Credentials,
    pub user_info: UserInformation,
}

impl TestUser {
    pub fn generate() -> Self {
        let credentials = Credentials{
            username: generate_random_chars(12),
            password: generate_random_chars(12),
        };

        let user_info = UserInformation {
            first_name: FirstName().fake(),
            last_name: LastName().fake(),
            email: SafeEmail().fake(),
            bio: Some(Paragraph(1..12).fake()),
        };

        Self {
            credentials,
            user_info,
        }
    }

    pub async fn store(&self, pool : &PgPool) {
        let mut tx = pool
            .begin()
            .await
            .expect("Failed to initialize transaction.");
        let id = Uuid::new_v4();
        create_user_from_credentials(&id, &self.credentials, &mut tx)
            .await
            .expect("Failed");

        create_users_info(&id, &self.user_info, &mut tx).await
            .expect("Failed");

        tx.commit().await.expect("failed to commit transaction.");


    }
}
