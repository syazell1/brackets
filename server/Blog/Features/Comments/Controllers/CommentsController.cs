using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Comments.Commands.AddComment.v1;
using Blog.Features.Comments.Commands.DeleteComment.v1;
using Blog.Features.Comments.Commands.UpdateComment.v1;
using Blog.Features.Comments.Dtos;
using Blog.Features.Comments.Queries.GetCommentById.v1;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Features.Comments.Controllers;

[Route("api/comments")]
public sealed class CommentsController : BaseController
{
    public CommentsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet("{commentId}")]
    public async Task<ActionResult<CommentDetailsDto>> GetCommentById(
        string commentId,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            GetCommentByIdQuery request = new(commentId);
            var result = await mediator.Send(request, cancellationToken);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return ex switch
            {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> AddComment(
        AddCommentCommand addComment,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var result = await mediator.Send(addComment, cancellationToken);

            return NoContent();
        }
        catch (Exception ex)
        {
            return ex switch
            {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                ConflictException conflict => BadRequest(new { message = conflict.Message }),
                ValidationException validation => BadRequest(new { errors = validation.Errors }),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }

    [Authorize]
    [HttpPatch("{commentId}")]
    public async Task<ActionResult> UpdateComment(
        string commentId,
        JsonPatchDocument<UpdateCommentDto> UpdateComment,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            UpdateCommentCommand request = new(commentId, UpdateComment);

            await mediator.Send(request, cancellationToken);

            return NoContent();
        }
        catch (Exception ex)
        {
            return ex switch
            {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                ConflictException conflict => BadRequest(new { message = conflict.Message }),
                ValidationException validation => BadRequest(new { errors = validation.Errors }),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }

    [HttpDelete("{commentId}")]
    public async Task<ActionResult> DeleteComment(string commentId,CancellationToken cancellationToken = default)
    {
        try
        {
            DeleteCommentCommand request = new(commentId);

            await mediator.Send(request, cancellationToken);

            return NoContent();
        }
        catch (Exception ex)
        {
            return ex switch
            {
                NotFoundException notFound => NotFound(new { message = notFound.Message }),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message })
            };
        }
    }
}