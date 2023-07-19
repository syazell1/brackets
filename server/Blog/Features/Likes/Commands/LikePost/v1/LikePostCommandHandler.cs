using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Likes.Interfaces;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Interfaces;
using MediatR;

namespace Blog.Features.Likes.Commands.LikePost.v1;

sealed class LikePostCommandHandler : ICommandHandler<LikePostCommand, Unit>
{
    private readonly IPostRepository _postRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILikePostRepository _likePostRepository;
    public LikePostCommandHandler(IPostRepository postRepository, IUsersRepository usersRepository, ICurrentUserService currentUserService, ILikePostRepository likePostRepository)
    {
        _postRepository = postRepository;
        _usersRepository = usersRepository;
        _currentUserService = currentUserService;
        _likePostRepository = likePostRepository;
    }
    public async Task<Unit> Handle(LikePostCommand request, CancellationToken cancellationToken)
    {
        var post =  await _postRepository.GetPostById(request.postId)
            ?? throw new NotFoundException($"Post with Id '{request.postId}' was not found.");

        var user = await _usersRepository.GetValue(x => x.Id.ToString() == _currentUserService.UserId)
            ?? throw new UnauthorizedAccessException("Invalid User, please login again.");

         // Check if User already liked the existing Post
        var existingLikes = await _likePostRepository.GetValue(
            x => x.PostId.ToString() == request.postId &&
            x.UserId.ToString() == _currentUserService.UserId
        );

        if(existingLikes is not null)
            throw new ConflictException($"User already liked this Post with Id '{request.postId}'");

        Entities.LikePost likedPosts = new()
        {
            PostId = post.Id, 
            UserId = user.Id
        };

        await _likePostRepository.Add(likedPosts);
        await _likePostRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}