using Blog.Commons.CQRS;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Interfaces;

namespace Blog.Features.Posts.Queries.GetPosts.v1;

sealed class GetPostsQueryHandler : IQueryHandler<GetPostsQuery, PagedList<PostsDto>>
{
    private readonly IPostRepository _postRepository;
    public GetPostsQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }
    public async Task<PagedList<PostsDto>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
    {
        var posts = _postRepository.GetPosts(
            request.Search,
            request.SortColumn,
            request.SortOrder
        );

        return await PagedList<PostsDto>.CreatePageList(posts, request.Page, request.PagSize);
    }
}