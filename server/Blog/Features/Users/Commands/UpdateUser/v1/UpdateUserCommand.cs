using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Users.Commands.UpdateUser.v1;

public sealed record UpdateUserCommand (
    string Username, 
    string Password,
    string FirstName,
    string LastName, 
    string Email, 
    string Bio
) : ICommand<Unit>;