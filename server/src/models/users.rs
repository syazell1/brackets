use secrecy::Secret;

#[derive(serde::Deserialize, validator::Validate)]
pub struct UsersRegistrationInput {
    pub username : String,
    pub password : Secret<String>,
    pub first_name : String,
    pub last_name : String,
    pub email : String,
    pub bio : Option<String>
}


#[derive(serde::Deserialize, validator::Validate)]
pub struct Credentials{
    pub username : String,
    pub password : Secret<String>
}