using Blog.Commons.CQRS;
using Blog.Features.Auth.Dtos;

namespace Blog.Features.Auth.Commands.RegisterUser.v1;

public sealed record RegisterUserCommand(
    string Username, 
    string Password,
    string? FirstName,
    string? LastName,
    string? Email)
: ICommand<(AuthDetailsDto, string)>;