using Blog.Features.Users.Dtos;

namespace Blog.Features.Comments.Dtos;

public sealed record CommentDetailsDto(
    Guid Id,
    string Content,
    PostInfoDto Post,
    UserDto Owner,
    DateTime CreatedAt
);