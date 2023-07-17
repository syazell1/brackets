using Blog.Commons.CQRS;
using Blog.Commons.Models;
using Blog.Features.Posts.Dtos;

namespace Blog.Features.Posts.Queries.GetPostsByOwnerId.v1;

public record GetPostsByOwnerIdQuery (
    string OwnerId,
    string? Search,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PagSize
): IQuery<PagedList<PostsDto>>;