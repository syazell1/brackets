using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Blog.Extensions;

public static class JwtExtension
{
    public static IServiceCollection AddJwtExtension(this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthentication(o =>
        {
            o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(cfg =>
        {
            cfg.TokenValidationParameters = new TokenValidationParameters
            {
                ClockSkew = TimeSpan.Zero,
                ValidateActor = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config["Authentication:Issuer"],
                ValidAudience = config["Authentication:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(config["Authentication:SecretForKey"] ?? throw new ArgumentNullException()))
            };
        });

        return services;
    }
}