using Blog.Commons.CQRS;
using Blog.Features.Auth.Dtos;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Users.Interfaces;

namespace Blog.Features.Auth.Commands.LoginUser.v1;

sealed class LoginUserCommandHandler : ICommandHandler<LoginUserCommand, (AuthDetailsDto, string)>
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;
    public LoginUserCommandHandler(IAuthRepository authRepository, IPasswordService passwordService, IJwtService jwtService)
    {
        _authRepository = authRepository;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    public async Task<(AuthDetailsDto, string)> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _authRepository.GetValue(x => x.Username == request.Username);

        if(user is null || !_passwordService.VerifyPassword(user.Password, request.Password, user.Salt))
            throw new UnauthorizedAccessException("Invalid Username or Password.");

        string accessToken = _jwtService.GenerateJwtToken(user.Id);
        string refreshToken = _jwtService.GenerateJwtToken(user.Id, true);

        AuthDetailsDto authDetails = new(user.Id.ToString(), user.Username, accessToken);

        return (authDetails, refreshToken);
    }
}