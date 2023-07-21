using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Likes.Interfaces;

namespace Blog.Features.Likes.Queries.GetLikedPost.v1;

sealed class GetLikedPostQueryHandler : IQueryHandler<GetLikedPostQuery, Guid>
{
    private readonly ILikePostRepository _likePostRepository;
    private readonly ICurrentUserService _currentUserService;
    public GetLikedPostQueryHandler(ILikePostRepository likePostRepository, ICurrentUserService currentUserService)
    {
        _likePostRepository = likePostRepository;
        _currentUserService = currentUserService;
    }
    public async Task<Guid> Handle(GetLikedPostQuery request, CancellationToken cancellationToken)
    {
        var existingLikes = await _likePostRepository.GetValue(
            x => x.PostId.ToString() == request.postId &&
            x.UserId.ToString() == _currentUserService.UserId
        ) ??
            throw new NotFoundException($"Likes record not found.");

        return existingLikes.Id;
    }
}