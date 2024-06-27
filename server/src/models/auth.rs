use serde::{Deserialize, Serialize};


#[derive(Deserialize)]
pub struct RegisterFormData {
    pub credentials: CredentialsFormData,
    pub info: UserInfoFormData,
}

#[derive(serde::Deserialize, Serialize)]
pub struct CredentialsFormData{
    pub username: String,
    pub password: String,
}

#[derive(serde::Deserialize)]
pub struct UserInfoFormData{
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    #[serde(skip_serializing_if = "Option::None")]
    pub bio: Option<String>,
}

