use secrecy::Secret;
use uuid::Uuid;

#[derive(serde::Deserialize)]
pub struct UsersRegistrationInput{
    pub credentials : UserCredentials,
    pub info : UserInfoInput
}

#[derive(serde::Deserialize, validator::Validate)]
pub struct UserInfoInput{
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    #[serde(skip_serializing_if = "Option::None")]
    pub bio : Option<String>
}

#[derive(serde::Deserialize, validator::Validate)]
pub struct UserCredentials {
    pub username: String,
    pub password: Secret<String>,
}

#[derive(serde::Serialize, sqlx::Type)]
pub struct UserInfo {
    pub id: Uuid,
    pub username: String,
}

#[derive(serde::Serialize)]
pub struct AuthInfo<'a>{
    pub access_token: &'a str,
    pub id: Uuid,
    pub username : &'a str
}
