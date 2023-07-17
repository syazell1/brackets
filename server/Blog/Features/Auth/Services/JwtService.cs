using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Blog.Features.Auth.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Blog.Features.Auth.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;
    public JwtService(IConfiguration config)
    {
        _config = config;
    }
    public string GenerateJwtToken(Guid Id, bool isRefreshToken = false)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Authentication:SecretForKey"]!)
        );

        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new Claim(JwtRegisteredClaimNames.Jti, Id.ToString())
        };

        var tokenToWrite = new JwtSecurityToken(
            _config["Authentication:Issuer"],
            _config["Authentication:Audience"],
            claims,
            DateTime.Now,
            isRefreshToken ? DateTime.Now.AddDays(7) : DateTime.Now.AddMinutes(12),
            signingCredentials
        );

        var token = new JwtSecurityTokenHandler().WriteToken(tokenToWrite);

        return token;
    }

    public bool VerifyRefreshToken(string refreshToken, out string userId)
    {
        var decoded = new JwtSecurityTokenHandler().ValidateToken(
            refreshToken,
            new TokenValidationParameters()
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config["Authentication:Issuer"],
                ValidAudience = _config["Authentication:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_config["Authentication:SecretForKey"]!)
                )
            },
            out SecurityToken validatedToken
        );


        var jti = decoded.FindFirstValue(JwtRegisteredClaimNames.Jti);
        if (validatedToken is not JwtSecurityToken jwtSecurityToken ||
           !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase) ||
            jti is null)
        {
            userId = string.Empty;
            return false;
        }

        userId = jti; 
        return true;
    }
}