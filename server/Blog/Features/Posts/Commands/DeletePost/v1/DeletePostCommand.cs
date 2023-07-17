using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Posts.Commands.DeletePost.v1;

public record DeletePostCommand (string PostId) : ICommand<Unit>
{
    
}