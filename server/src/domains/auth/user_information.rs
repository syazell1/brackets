use unicode_segmentation::UnicodeSegmentation;
use validator::{Validate, ValidationError};

use crate::{errors::AppError, models::UserInfoFormData};

#[derive(validator::Validate)]
pub struct UserInformation {
    #[validate(custom(function = "parse_first_name"))]
    pub first_name: String,
    #[validate(custom(function = "parse_last_name"))]
    pub last_name: String,
    #[validate(email)]
    pub email: String,
    #[validate(custom(function = "parse_bio"))]
    pub bio: Option<String>
}

fn parse_first_name(v: &str) -> Result<(), ValidationError> {
    let is_empty = v.trim().is_empty();

    let is_too_long = v.graphemes(true).count() > 256;

    let forbidden_chars = ['!', '@', '#', '$', '%'];
    let is_forbidden = v.chars().any(|g| forbidden_chars.contains(&g));

    if is_empty || is_too_long || is_forbidden {
        return Err(ValidationError::new("Invalid Username."));
    }

    Ok(())
}

fn parse_last_name(v: &str) -> Result<(), ValidationError> {
    let is_empty = v.trim().is_empty();

    let is_too_long = v.graphemes(true).count() > 256;

    let forbidden_chars = ['!', '@', '#', '$', '%'];
    let is_forbidden = v.chars().any(|g| forbidden_chars.contains(&g));

    if is_empty || is_too_long || is_forbidden {
        return Err(ValidationError::new("Invalid Password."));
    }

    Ok(())
}

fn parse_bio(v : &str) -> Result<(), ValidationError> {
    let is_too_long = v.graphemes(true).count() > 200;

    if is_too_long {
        return Err(ValidationError::new("Invalid bio."));
    }

    Ok(())
}


impl TryFrom<UserInfoFormData> for UserInformation{
    type Error = AppError;

    fn try_from(value: UserInfoFormData) -> Result<Self, Self::Error> {
        let UserInfoFormData {
            first_name, 
            last_name,
            email,
            bio
        } = value;
        let c = Self {first_name, last_name, email, bio};
        c.validate()?;
        Ok(c)
    }
}