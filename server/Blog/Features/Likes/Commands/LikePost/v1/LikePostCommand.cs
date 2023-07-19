using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Likes.Commands.LikePost;

public sealed record LikePostCommand(string postId) : ICommand<Unit>;