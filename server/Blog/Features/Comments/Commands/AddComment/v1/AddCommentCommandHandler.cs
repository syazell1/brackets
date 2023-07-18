using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Entities;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Comments.Interfaces;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Interfaces;

namespace Blog.Features.Comments.Commands.AddComment.v1;

sealed class AddCommentCommandHandler : ICommandHandler<AddCommentCommand, Guid>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUsersRepository _usersRepository;
    public AddCommentCommandHandler(ICommentRepository commentRepository, ICurrentUserService currentUserService, IPostRepository postRepository, IUsersRepository usersRepository)
    {
        _commentRepository = commentRepository;
        _currentUserService = currentUserService;
        _postRepository = postRepository;
        _usersRepository = usersRepository;
    }
    public async Task<Guid> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        var post =  await _postRepository.GetPostById(request.PostId)
            ?? throw new NotFoundException($"Post with Id '' was not found.");

        var user = await _usersRepository.GetValue(x => x.Id.ToString() == _currentUserService.UserId)
            ?? throw new UnauthorizedAccessException("Invalid User, please login again.");
        
        Comment newComment = new()
        {
            Content = request.Content,
            PostId = post.Id,
            OwnerId = user.Id
        };

        await _commentRepository.Add(newComment);
        await _commentRepository.SaveChangesAsync(cancellationToken);

        return newComment.Id;
    }
}