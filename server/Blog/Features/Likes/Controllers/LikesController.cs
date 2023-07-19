using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Likes.Commands.LikePost;
using Blog.Features.Likes.Commands.UnlikePost.v1;
using Blog.Features.Likes.Queries.GetLikedPost.v1;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Features.Likes.Controllers;

[Authorize]
[Route("api")]
public sealed class LikesController : BaseController
{
    public LikesController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet("posts/{postId}/record")]
    public async Task<ActionResult> GetLikedPost(string postId, CancellationToken cancellationToken = default)
    {
        try
        {
            GetLikedPostQuery request = new(postId);

            var result = await mediator.Send(request, cancellationToken);

            return Ok(new {id = result});
        }
        catch(Exception ex)
        {
            return ex switch {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }

    [HttpPost("posts/{postId}/like")]
    public async Task<ActionResult> LikePost(string postId, CancellationToken cancellationToken = default)
    {
        try
        {
            LikePostCommand request = new(postId);
            var result = await mediator.Send(request, cancellationToken);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return ex switch {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                ConflictException conflict => BadRequest(new {message = conflict.Message}),
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }

    [HttpPost("posts/{postId}/unlike")]
    public async Task<ActionResult> UnlikePost(string postId, CancellationToken cancellationToken = default)
    {
        try
        {
            UnlikePostCommand request = new(postId);
            var result = await mediator.Send(request, cancellationToken);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return ex switch {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                ConflictException conflict => BadRequest(new {message = conflict.Message}),
                UnauthorizedAccessException unauthorized => Unauthorized(new {message = unauthorized.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }
}