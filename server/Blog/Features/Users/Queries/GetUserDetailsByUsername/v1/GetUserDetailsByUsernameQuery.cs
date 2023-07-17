using Blog.Commons.CQRS;
using Blog.Features.Users.Dtos;

namespace Blog.Features.Users.Queries.GetUserDetailsByUsername.v1;

public sealed record GetUserDetailsByUsernameQuery (string username) : IQuery<UserDetailsDto>;