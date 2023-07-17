using Blog.Commons.CQRS;
using Blog.Features.Auth.Dtos;
using Blog.Features.Auth.Interfaces;

namespace Blog.Features.Auth.Queries.RefreshUserToken.v1;

sealed class RefreshUserTokenQueryHandler : IQueryHandler<RefreshUserTokenQuery, (AuthDetailsDto, string)>
{
    private readonly IAuthRepository _authRepository;
    private readonly IJwtService _jwtService;
    public RefreshUserTokenQueryHandler(IAuthRepository authRepository, IJwtService jwtService)
    {
        _authRepository = authRepository;
        _jwtService = jwtService;
    }
    public async Task<(AuthDetailsDto, string)> Handle(RefreshUserTokenQuery request, CancellationToken cancellationToken)
    {
        if(!_jwtService.VerifyRefreshToken(request.RefreshToken, out string userId))
            throw new UnauthorizedAccessException("Invalid Refresh Token");

        var user = await _authRepository.GetValue(x => x.Id.ToString() == userId) ??
            throw new UnauthorizedAccessException("Invalid User, Please login again.");

        string accessToken = _jwtService.GenerateJwtToken(user.Id);
        string refreshToken = _jwtService.GenerateJwtToken(user.Id, true);

        AuthDetailsDto authDetails = new(user.Id.ToString(), user.Username, accessToken);

        return (authDetails, refreshToken);
    }
}