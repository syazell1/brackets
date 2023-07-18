using Blog.Commons.CQRS;
using Blog.Features.Comments.Dtos;
using MediatR;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Blog.Features.Comments.Commands.UpdateComment.v1;

public sealed record UpdateCommentCommand(
    string CommentId, 
    JsonPatchDocument<UpdateCommentDto> UpdateComment
) : ICommand<Unit>;