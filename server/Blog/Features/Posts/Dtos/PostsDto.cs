using Blog.Features.Users.Dtos;

namespace Blog.Features.Posts.Dtos;

public sealed record PostsDto(
    Guid Id, 
    string Title, 
    string Content, 
    int LikeCount,
    int CommentCount,
    UserDto Owner, 
    DateTime CreatedAt);