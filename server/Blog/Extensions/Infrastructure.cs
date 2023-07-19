using Blog.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using System.Reflection;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Auth.Repositories;
using Blog.Features.Users.Interfaces;
using Blog.Features.Users.Services;
using Blog.Features.Auth.Services;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Repositories;
using Blog.Features.Comments.Interfaces;
using Blog.Features.Comments.Repositories;
using Blog.Features.Likes.Repositories;
using Blog.Features.Likes.Interfaces;

namespace Blog.Extensions;

public static class Infrastructure
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<ApplicationDbContext>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IPostRepository, PostRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<IUsersInfoRepository, UsersInfoRepository>();
        services.AddScoped<ILikePostRepository, LikePostRepository>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatRExtension();
        services.AddJwtExtension(config);
        return services;
    }
}