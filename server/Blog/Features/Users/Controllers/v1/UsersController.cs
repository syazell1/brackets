using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Queries.GetPostsByOwnerName.v1;
using Blog.Features.Users.Commands.UpdateUser.v1;
using Blog.Features.Users.Dtos;
using Blog.Features.Users.Queries.GetUserDetailsByUsername.v1;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Features.Users.Controllers.v1;

[Route("api/users")]
public sealed class UsersController : BaseController
{
    public UsersController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet("{ownerName}/posts")]
    public async Task<ActionResult<PagedList<PostsDto>>> GetPostsByOwnerName(
        string ownerName,
        string? search,
        string? sortColumn,
        string? sortOrder,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            GetPostsByOwnerNameQuery request = new(
                ownerName,
                search,
                sortColumn,
                sortOrder,
                page,
                pageSize
            );

            var result = await mediator.Send(request, cancellationToken);

            return Ok(result);
        }
        catch(Exception ex)
        {
            return ex switch {
                NotFoundException notFound => NotFound(new {message = notFound.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {message = ex.Message})
            };
        }
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<UserDetailsDto>> GetUserDetailsByUsername(string username, CancellationToken cancellationToken = default)
    {
        try
        {
            GetUserDetailsByUsernameQuery request = new(username);
            
            var user = await mediator.Send(request, cancellationToken);

            return Ok(user);
        }
        catch(Exception ex)
        {
             return ex switch {
                NotFoundException notFound => NotFound(new {message = notFound.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {message = ex.Message})
            };
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<PagedList<PostsDto>>> UpdateUser(
        UpdateUserCommand updateUser,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var result = await mediator.Send(updateUser, cancellationToken);

            return NoContent(); 
        }
        catch(Exception ex)
        {
            return ex switch {
                ConflictException conflict => BadRequest(new {message = conflict.Message}),
                ValidationException validation => BadRequest(new {errors = validation.Errors}),
                UnauthorizedAccessException unauthorized => Unauthorized(new {messasge = unauthorized.Message}),
                NotFoundException notFound => NotFound(new {message = notFound.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {message = ex.Message})
            };
        }
    }
}