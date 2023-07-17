using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Posts.Interfaces;
using MediatR;

namespace Blog.Features.Posts.Commands.DeletePost.v1;

sealed class DeletePostCommandHandler : ICommandHandler<DeletePostCommand, Unit>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    public DeletePostCommandHandler(IPostRepository postRepository, ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }
    public async Task<Unit> Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetValue(
            x => x.Id.ToString() == request.PostId &&
            x.OwnerId.ToString() == _currentUserService.UserId)
            ?? throw new NotFoundException($"Post with Id '{request.PostId}' was not found.");

        _postRepository.Delete(post);
        await _postRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}