using Blog.Commons.CQRS;
using Blog.Features.Auth.Dtos;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Users.Dtos;

namespace Blog.Features.Auth.Queries.CurrentUser.v1;

sealed class CurrentUserQueryHandler : ICommandHandler<CurrentUserQuery, UserDto>
{
    private readonly IAuthRepository _authRepository;
    private readonly ICurrentUserService _currentUserService;
    public CurrentUserQueryHandler(IAuthRepository authRepository, ICurrentUserService currentUserService)
    {
        _authRepository = authRepository;
        _currentUserService = currentUserService;
    }
    public async Task<UserDto> Handle(CurrentUserQuery request, CancellationToken cancellationToken)
    {
        var users = await _authRepository.GetValue(x => x.Id.ToString() == _currentUserService.UserId)
            ?? throw new UnauthorizedAccessException("Invalid User, Please login again.");

        UserDto userDetail = new(users.Id, users.Username);

        return userDetail;
    }
}