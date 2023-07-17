using Blog.Commons.CQRS;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;

namespace Blog.Features.Posts.Queries.GetPosts.v1;

public sealed record GetPostsQuery(
    string? Search,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PagSize
) : IQuery<PagedList<PostsDto>>;