using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Interfaces;

namespace Blog.Features.Posts.Queries.GetPostsByOwnerId.v1;

sealed class GetPostsByOwnerIdQueryHandler : IQueryHandler<GetPostsByOwnerIdQuery, PagedList<PostsDto>>
{
    private readonly IPostRepository _postRepository;
    private readonly IUsersRepository _usersRepository;
    public GetPostsByOwnerIdQueryHandler(IPostRepository postRepository, IUsersRepository usersRepository)
    {
        _postRepository = postRepository;
        _usersRepository = usersRepository;
    }
    public async Task<PagedList<PostsDto>> Handle(GetPostsByOwnerIdQuery request, CancellationToken cancellationToken)
    {
        var _ = await _usersRepository.GetValue(x => x.Id.ToString() == request.OwnerId)
            ?? throw new NotFoundException($"User with Id '{request.OwnerId}' was not found.");

        var posts = _postRepository.GetPostsByOwnerId(request.OwnerId, request.Search, request.SortColumn, request.SortOrder);

        return await PagedList<PostsDto>.CreatePageList(posts, request.Page, request.PagSize);
    }
}