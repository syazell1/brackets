using Blog.Commons.CQRS;
using Blog.Features.Comments.Dtos;

namespace Blog.Features.Comments.Queries.GetCommentById.v1;

public sealed record GetCommentByIdQuery (string CommentId): IQuery<CommentDetailsDto>;