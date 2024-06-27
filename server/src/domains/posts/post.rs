use uuid::{NoContext, Timestamp, Uuid};
use validator::Validate;

use crate::{errors::AppError, models::PostsInput};

#[derive(validator::Validate)]
pub struct Post {
    pub id : Uuid, 
    #[validate(length(min = 4))]
    pub title : String,
    #[validate(length(min = 4))]
    pub content : String,
    pub is_deleted: bool
}

impl Post {
    pub fn create(title : String, content : String) -> Self{
        let id = Uuid::new_v7(Timestamp::now(NoContext));

        Self {
            id,
            title,
            content,
            is_deleted : false
        } 
    }
}

impl TryFrom<PostsInput>for Post {
    type Error = AppError;
    fn try_from(value: PostsInput) -> Result<Self, Self::Error>{
        let PostsInput {title, content} = value;
        let p = Self::create(title, content);
        p.validate()?;
        Ok(p)
    }
}

pub trait UpdatePostTo{
    fn try_update_into(self, user_id : &Uuid) -> Result<Post, AppError>;
}


#[cfg(test)]
mod tests {
    use claims::assert_ok;
    use fake::{faker::lorem::en::{Paragraph, Sentence}, Fake};
    use uuid::Uuid;
    use validator::Validate;

    use super::Post;

    fn get_test_post() -> Post {
        Post {
            id : Uuid::new_v4(),
            title :Paragraph(1..12).fake(),
            content: Sentence(1..12).fake(),
            is_deleted: false
        }
    }

    #[test]
    fn a_valid_post_is_accepted() {
        let post = get_test_post();

        assert_ok!(post.validate());
    }
}