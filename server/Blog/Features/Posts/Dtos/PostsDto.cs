using Blog.Features.Users.Dtos;

namespace Blog.Features.Posts.Dtos;

public sealed record PostsDto(Guid Id, string Title, string Content, UserDto Owner, DateTime CreatedAt);