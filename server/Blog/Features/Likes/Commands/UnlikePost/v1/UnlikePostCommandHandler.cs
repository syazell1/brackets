using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Likes.Interfaces;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Interfaces;
using MediatR;

namespace Blog.Features.Likes.Commands.UnlikePost.v1;

sealed class UnlikePostCommandHandler : ICommandHandler<UnlikePostCommand, Unit>
{
    private readonly IPostRepository _postRepository;
    private readonly ILikePostRepository _likePostRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly ICurrentUserService _currentUserService;
    public UnlikePostCommandHandler(IPostRepository postRepository, ILikePostRepository likePostRepository, IUsersRepository usersRepository, ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _likePostRepository = likePostRepository;
        _usersRepository = usersRepository;
        _currentUserService = currentUserService;
    }
    public async Task<Unit> Handle(UnlikePostCommand request, CancellationToken cancellationToken)
    {
        var user = await _usersRepository.GetValue(
            x => x.Id.ToString() == _currentUserService.UserId 
        )
            ?? throw new UnauthorizedAccessException("Invalid User, please login again.");

        // check if the post exists
        var post = await _postRepository.GetPostById(request.PostId)
            ?? throw new NotFoundException($"Post with Id '{request.PostId}' was not found.");

        // Check if likes was existing
        // else, throw an error 
        var existingLikes = await _likePostRepository.GetValue(
            x => x.PostId.ToString() == request.PostId &&
            x.UserId.ToString() == _currentUserService.UserId
        ) ??
            throw new ConflictException($"Likes record not found.");

        _likePostRepository.Delete(existingLikes);
        await _likePostRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}