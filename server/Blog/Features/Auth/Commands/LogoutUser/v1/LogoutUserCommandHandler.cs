using Blog.Commons.CQRS;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Users.Interfaces;
using MediatR;

namespace Blog.Features.Auth.Commands.LogoutUser.v1;

sealed class LogoutUserCommandHandler : ICommandHandler<LogoutUserCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUsersRepository _usersRepository;
    public LogoutUserCommandHandler(ICurrentUserService currentUserService, IUsersRepository usersRepository)
    {
        _currentUserService = currentUserService;
        _usersRepository = usersRepository;
    }
    public async Task<Unit> Handle(LogoutUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _usersRepository.GetValue(
            x => x.Id.ToString() == _currentUserService.UserId
        ) ?? throw new UnauthorizedAccessException("Invalid User, Please login again.");

        return Unit.Value;
    }
}