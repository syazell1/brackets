using Blog.Commons.CQRS;

namespace Blog.Features.Posts.Commands.CreatePost.v1;

public sealed record CreatePostCommand(string Title, string Content): ICommand<Guid>;