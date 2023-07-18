using Blog.Commons.CQRS;

namespace Blog.Features.Comments.Commands.AddComment.v1;

public sealed record AddCommentCommand(string PostId, string Content) : ICommand<Guid>;