using Blog.Commons.CQRS;
using Blog.Features.Users.Dtos;

namespace Blog.Features.Auth.Queries.CurrentUser.v1;

public sealed record CurrentUserQuery : ICommand<UserDto>;