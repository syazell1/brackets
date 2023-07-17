using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Blog.Features.Auth.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Blog.Features.Auth.Services;

public sealed class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _http;
    public CurrentUserService(IHttpContextAccessor http)
    {
        _http = http;
    }
    public string? UserId => _http.HttpContext?.User.FindFirstValue(JwtRegisteredClaimNames.Jti);
}