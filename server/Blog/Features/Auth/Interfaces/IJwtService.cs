namespace Blog.Features.Auth.Interfaces;

public interface IJwtService
{
    string GenerateJwtToken(Guid Id, bool isRefreshToken = false);
    bool VerifyRefreshToken(string refreshToken, out string userId);
}