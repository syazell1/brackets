using Blog.Commons.CQRS;
using Blog.Entities;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Posts.Interfaces;

namespace Blog.Features.Posts.Commands.CreatePost.v1;

sealed class CreatePostCommandHandler : ICommandHandler<CreatePostCommand, Guid>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    public CreatePostCommandHandler(IPostRepository postRepository, ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }
    public async Task<Guid> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        Post newPost = new()
        {
            Title = request.Title,
            Content = request.Content,
            OwnerId = Guid.Parse(_currentUserService.UserId!)
        };

        await _postRepository.Add(newPost, cancellationToken);
        await _postRepository.SaveChangesAsync();

        return newPost.Id;
    }
}