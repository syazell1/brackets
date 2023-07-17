using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Interfaces;

namespace Blog.Features.Posts.Queries.GetPostsByOwnerName.v1;

sealed class GetPostsByOwnerNameQueryHandler : IQueryHandler<GetPostsByOwnerNameQuery, PagedList<PostsDto>>
{
    private readonly IPostRepository _postRepository;
    private readonly IUsersRepository _usersRepository;
    public GetPostsByOwnerNameQueryHandler(IPostRepository postRepository, IUsersRepository usersRepository)
    {
        _postRepository = postRepository;
        _usersRepository = usersRepository;
    }
    public async Task<PagedList<PostsDto>> Handle(GetPostsByOwnerNameQuery request, CancellationToken cancellationToken)
    {
        var user = await _usersRepository.GetValue(x => x.Username.ToLower() == request.OwnerName.ToLower())
            ?? throw new NotFoundException($"Owner Name with Username '{request.OwnerName}' was not found.");


        var posts = _postRepository.GetPostsByOwnerName(
            request.OwnerName,
            request.Search,
            request.SortColumn,
            request.SortOrder
        );

        return await PagedList<PostsDto>.CreatePageList(posts, request.Page, request.PagSize);
    }
}