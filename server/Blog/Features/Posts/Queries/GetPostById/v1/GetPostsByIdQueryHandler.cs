using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Interfaces;

namespace Blog.Features.Posts.Queries.GetPostById.v1;

sealed class GetPostsByIdQueryHandler : IQueryHandler<GetPostByIdQuery, PostsDto>
{
    private readonly IPostRepository _postRepository;
    public GetPostsByIdQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }
    public async Task<PostsDto> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetPostById(request.PostId)
            ?? throw new NotFoundException($"Post with Id '{request.PostId}' was not found.");

        return post;
    }
}