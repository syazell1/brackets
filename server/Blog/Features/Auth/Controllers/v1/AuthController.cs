using Asp.Versioning;
using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Auth.Commands.LoginUser.v1;
using Blog.Features.Auth.Commands.LogoutUser.v1;
using Blog.Features.Auth.Commands.RegisterUser.v1;
using Blog.Features.Auth.Dtos;
using Blog.Features.Auth.Queries.CurrentUser.v1;
using Blog.Features.Auth.Queries.RefreshUserToken.v1;
using Blog.Features.Users.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Features.Auth.Controllers.v1;

[ApiVersion(1.0)]
[Route("api/auth")]
public class AuthController : BaseController
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthDetailsDto>> LoginUser(
        LoginUserCommand loginUser,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var (authDetails, refreshToken) = await mediator.Send(loginUser, cancellationToken);

            Response.Cookies.Append("rt", refreshToken, new CookieOptions
            {
                MaxAge = TimeSpan.FromDays(7),
                SameSite = SameSiteMode.Lax,
                HttpOnly = true
            });

            return Ok(authDetails);
        }
        catch(Exception ex)
        {
            return ex switch {
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {mesage = ex.Message})
            };
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthDetailsDto>> RegisterUser(
        RegisterUserCommand registerUser,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var (authDetails, refreshToken) = await mediator.Send(registerUser, cancellationToken);

            Response.Cookies.Append("rt", refreshToken, new CookieOptions
            {
                MaxAge = TimeSpan.FromDays(7),
                SameSite = SameSiteMode.Lax,
                HttpOnly = true
            });

            return Ok(authDetails);
        }
        catch(Exception ex)
        {
            return ex switch {
                ConflictException conflict => BadRequest(new {message = conflict.Message}),
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {mesage = ex.Message})
            };
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<AuthDetailsDto>> LogoutUser(CancellationToken cancellationToken = default)
    {
        try
        {
            LogoutUserCommand request = new();

            await mediator.Send(request, cancellationToken);

            Response.Cookies.Delete("rt", new CookieOptions
            {
                MaxAge = TimeSpan.FromDays(7),
                SameSite = SameSiteMode.Lax,
                HttpOnly = true
            });

            return Ok();
        }
        catch(Exception ex)
        {
            return ex switch {
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {mesage = ex.Message})
            };
        }
    }


    [HttpGet("refresh")]
    public async Task<ActionResult<AuthDetailsDto>> RefreshUserToken(CancellationToken cancellationToken = default)
    {
        try
        {
            var refreshToken = Request.Cookies["rt"];

            if(refreshToken is null)
                return Unauthorized(new {mesage = "Refresh token was not found."});

            RefreshUserTokenQuery request = new(refreshToken);

            var (authDetails, rt) = await mediator.Send(request, cancellationToken);

            Response.Cookies.Append("rt", rt, new CookieOptions
            {
                MaxAge = TimeSpan.FromDays(7),
                SameSite = SameSiteMode.Lax,
                HttpOnly = true
            });

            return Ok(authDetails);
        }
        catch(Exception ex)
        {
            return ex switch {
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {mesage = ex.Message})
            };
        }
    }

    [Authorize]
    [HttpGet("users")]
    public async Task<ActionResult<UserDto>> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        try
        {
            CurrentUserQuery request = new();

            var results = await mediator.Send(request, cancellationToken);

            return Ok(results);
        }
        catch(Exception ex)
        {
            return ex switch {
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {mesage = ex.Message})
            };
        }
    }
}