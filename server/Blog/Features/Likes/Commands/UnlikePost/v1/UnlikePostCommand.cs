using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Likes.Commands.UnlikePost.v1;

public sealed record UnlikePostCommand(string PostId) : ICommand<Unit>;