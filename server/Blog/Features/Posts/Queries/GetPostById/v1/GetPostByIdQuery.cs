using Blog.Commons.CQRS;
using Blog.Features.Posts.Dtos;

namespace Blog.Features.Posts.Queries.GetPostById.v1;

public sealed record GetPostByIdQuery(string PostId) : IQuery<PostsDto>;