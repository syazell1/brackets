using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Comments.Dtos;
using Blog.Features.Comments.Queries.GetCommentsByPostId.v1;
using Blog.Features.Posts.Commands.CreatePost.v1;
using Blog.Features.Posts.Commands.DeletePost.v1;
using Blog.Features.Posts.Commands.UpdatePost.v1;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Queries.GetPostById.v1;
using Blog.Features.Posts.Queries.GetPosts.v1;
using Blog.Features.Posts.Queries.GetPostsByOwnerName.v1;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Features.Posts.Controllers.v1;

[Route("api/posts")]
public sealed class PostsController : BaseController
{
    public PostsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<PostsDto>>> GetPosts(
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
            GetPostsQuery request = new(
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

    [HttpGet("{postId}", Name = "GetPostById")]
    public async Task<ActionResult<PostsDto>> GetPostById(
        string postId,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            GetPostByIdQuery request = new(postId);

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

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> CreatePost(
        CreatePostCommand createPost,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var result = await mediator.Send(createPost, cancellationToken);

            return CreatedAtRoute("GetPostById", new {postId = result}, result);
        }
        catch(Exception ex)
        {
            return ex switch {
                ValidationException validation => BadRequest(new {errors = validation.Errors}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {message = ex.Message})
            };
        }
    }

    [Authorize]
    [HttpPatch("{postId}")]
    public async Task<ActionResult> DeletePost(
        string postId,
        JsonPatchDocument<UpdatePostDto> UpdatePost,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            UpdatePostCommand request = new(postId, UpdatePost);
            var result = await mediator.Send(request, cancellationToken);

            return NoContent(); 
        }
        catch(Exception ex)
        {
            return ex switch {
                ValidationException validation => BadRequest(new {errors = validation.Errors}),
                ConflictException conflict => BadRequest(new {message = conflict.Message}),
                NotFoundException notFound => NotFound(new {message = notFound.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {message = ex.Message})
            };
        }
    }

    [Authorize]
    [HttpDelete("{postId}")]
    public async Task<ActionResult> DeletePost(
        string postId,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            DeletePostCommand request = new(postId);
            var result = await mediator.Send(request, cancellationToken);

            return NoContent(); 
        }
        catch(Exception ex)
        {
            return ex switch {
                NotFoundException notFound => NotFound(new {message = notFound.Message}),
                _ => StatusCode(StatusCodes.Status500InternalServerError, new {message = ex.Message})
            };
        }
    }

    [HttpGet("{postId}/comments")]
    public async Task<ActionResult<PagedList<CommentDto>>> GetPostsComments(
        string postId,
        string? sortColumn,
        string? sortOrder,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            GetCommentsByPostIdQuery request = new(
                postId,
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
}