using Blog.Commons.CQRS;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;

namespace Blog.Features.Posts.Queries.GetPostsByOwnerName.v1;

public sealed record GetPostsByOwnerNameQuery (
    string OwnerName,
    string? Search,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PagSize    
) : IQuery<PagedList<PostsDto>>;