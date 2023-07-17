using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Entities;
using Blog.Features.Auth.Dtos;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Users.Interfaces;

namespace Blog.Features.Auth.Commands.RegisterUser.v1;

sealed class RegisterUserCommandHandler : ICommandHandler<RegisterUserCommand, (AuthDetailsDto, string)>
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;
    public RegisterUserCommandHandler(IAuthRepository authRepository, IPasswordService passwordService, IJwtService jwtService)
    {
        _authRepository = authRepository;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }
    public async Task<(AuthDetailsDto, string)> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _authRepository.GetValue(x => x.Username.ToLower() == request.Username.ToLower());

        if(user is not null)
            throw new ConflictException("Username already exists.");

        UsersInfo newUsersInfo = new()
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        User newUser = new()
        {
            Username = request.Username,
            Password = _passwordService.HashPassword(request.Password, out string salt),
            Salt = salt,
            UsersInfo = newUsersInfo 
        };

        await _authRepository.Add(newUser, cancellationToken);
        await _authRepository.SaveChangesAsync(cancellationToken);

        string accessToken = _jwtService.GenerateJwtToken(newUser.Id);
        string refreshToken = _jwtService.GenerateJwtToken(newUser.Id, true);

        AuthDetailsDto authDetails = new(newUser.Id.ToString(), newUser.Username, accessToken);

        return (authDetails, refreshToken);
    }
}