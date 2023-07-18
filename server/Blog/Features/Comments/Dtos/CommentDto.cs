using Blog.Features.Users.Dtos;

namespace Blog.Features.Comments.Dtos;

public sealed record CommentDto (
    Guid Id,
    string Content,
    Guid PostId,
    UserDto Owner,
    DateTime CreatedAt
);