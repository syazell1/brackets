using Blog.Commons.CQRS;
using Blog.Features.Auth.Dtos;

namespace Blog.Features.Auth.Commands.LoginUser.v1;

public sealed record LoginUserCommand(string Username, string Password) : ICommand<(AuthDetailsDto, string)>;