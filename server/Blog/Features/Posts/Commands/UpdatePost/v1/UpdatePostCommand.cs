using Blog.Commons.CQRS;
using Blog.Features.Posts.Dtos;
using MediatR;
using Microsoft.AspNetCore.JsonPatch;

namespace Blog.Features.Posts.Commands.UpdatePost.v1;

public sealed record UpdatePostCommand (string PostId, JsonPatchDocument<UpdatePostDto> UpdatePost) : ICommand<Unit>;