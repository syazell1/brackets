using Blog.Commons.CQRS;
using MediatR;

namespace Blog.Features.Likes.Queries.GetLikedPost.v1;

public sealed record GetLikedPostQuery (string postId): IQuery<Guid>;