using Blog.Commons.CQRS;
using Blog.Features.Auth.Dtos;

namespace Blog.Features.Auth.Queries.RefreshUserToken.v1;

public sealed record RefreshUserTokenQuery (string RefreshToken): IQuery<(AuthDetailsDto, string)>;