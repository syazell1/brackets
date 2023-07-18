using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Comments.Commands.DeleteComment.v1;

public sealed record DeleteCommentCommand(string CommentId) : ICommand<Unit>;