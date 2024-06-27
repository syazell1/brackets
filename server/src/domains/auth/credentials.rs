use serde::Serialize;
use unicode_segmentation::UnicodeSegmentation;
use validator::{Validate, ValidationError};

use crate::{errors::AppError, models::CredentialsFormData};

#[derive(Validate, Serialize)]
pub struct Credentials {
    #[validate(custom(function = "parse_username"))]
    pub username : String,
    #[validate(custom(function = "parse_password"))]
    pub password : String
}

fn parse_username(v: &str) -> Result<(), ValidationError> {
    let is_empty = v.trim().is_empty();

    let is_too_long = v.graphemes(true).count() > 12;

    let forbidden_chars = ['!', '@', '#', '$', '%'];
    let is_forbidden = v.chars().any(|g| forbidden_chars.contains(&g));

    if is_empty || is_too_long || is_forbidden {
        return Err(ValidationError::new("Invalid Username."));
    }

    Ok(())
}

fn parse_password(v: &str) -> Result<(), ValidationError> {
    let is_empty = v.trim().is_empty();

    let is_too_long = v.graphemes(true).count() > 12;

    let forbidden_chars = ['!', '@', '#', '$', '%'];
    let is_forbidden = v.chars().any(|g| forbidden_chars.contains(&g));

    if is_empty || is_too_long || is_forbidden {
        return Err(ValidationError::new("Invalid Password."));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use claims::{assert_err, assert_ok};
    use validator::Validate;
    use crate::startup::generate_random_chars;

    use super::Credentials;

    fn get_test_user() -> Credentials {
        Credentials {
            username: generate_random_chars(12),
            password: generate_random_chars(12),
        }
    }

    fn get_test_forbidden_chars() -> Vec<char> {
        vec!['!', '@', '#', '$', '%']
    }

    #[test]
    fn a_valid_credentials_is_accepted() {
        let user = get_test_user();

        assert_ok!(user.validate());
    }

    #[test]
    fn a_blank_username_is_invalid() {
        let mut user = get_test_user();
        user.username = "".into();

        assert_err!(user.validate());
    }

    #[test]
    fn a_12_characters_username_is_valid() {
        let user = get_test_user();

        assert_ok!(user.validate());
        assert_eq!(12, user.username.as_str().len())
    }

    #[test]
    fn a_more_than_12_characters_username_is_rejected() {
        let mut user = get_test_user();
        user.username = user.username.repeat(12);

        assert_err!(user.validate());
        assert_ne!(12, user.username.as_str().len());
    }

    #[test]
    fn a_username_with_forbidden_characters_is_rejected() {
        let mut user = get_test_user();

        for v in get_test_forbidden_chars().iter() {
            user.username = v.to_string();

            assert_err!(user.validate());
        }
    }

    #[test]
    fn a_blank_password_is_invalid() {
        let mut user = get_test_user();
        user.password = "".into();

        assert_err!(user.validate());
    }

    #[test]
    fn a_12_characters_password_is_valid() {
        let user = get_test_user();

        assert_ok!(user.validate());
        assert_eq!(12, user.password.as_str().len())
    }

    #[test]
    fn a_more_than_12_characters_password_is_rejected() {
        let mut user = get_test_user();
        user.password = user.password.repeat(12);

        assert_err!(user.validate());
        assert_ne!(12, user.password.as_str().len());
    }

    #[test]
    fn a_password_with_forbidden_characters_is_rejected() {
        let mut user = get_test_user();

        for v in get_test_forbidden_chars().iter() {
            user.password = v.to_string();

            assert_err!(user.validate());
        }
    }
}

impl TryFrom<CredentialsFormData> for Credentials {
    type Error = AppError;

    fn try_from(value: CredentialsFormData) -> Result<Self, Self::Error> {
        let CredentialsFormData {username , password } = value;
        let c = Self {username, password};
        c.validate()?;
        Ok(c)
    }
}