using Blog.Commons.CQRS;
using Blog.Commons.Models;
using Blog.Features.Comments.Dtos;

namespace Blog.Features.Comments.Queries.GetCommentsByPostId.v1;

public sealed record GetCommentsByPostIdQuery (
    string PostId,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize
) : IQuery<PagedList<CommentDto>>;