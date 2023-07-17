using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Auth.Commands.LogoutUser.v1;

public record LogoutUserCommand : ICommand<Unit>;