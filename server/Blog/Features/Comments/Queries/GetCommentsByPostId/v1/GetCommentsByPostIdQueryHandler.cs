using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Commons.Models;
using Blog.Features.Comments.Dtos;
using Blog.Features.Comments.Interfaces;
using Blog.Features.Posts.Interfaces;

namespace Blog.Features.Comments.Queries.GetCommentsByPostId.v1;

sealed class GetCommentsByPostIdQueryHandler : IQueryHandler<GetCommentsByPostIdQuery, PagedList<CommentDto>>
{
    private readonly IPostRepository _postsRepository;
    private readonly ICommentRepository _commentRepository;
    public GetCommentsByPostIdQueryHandler(ICommentRepository commentRepository, IPostRepository postsRepository)
    {
        _commentRepository = commentRepository;
        _postsRepository = postsRepository;
    }
    public async Task<PagedList<CommentDto>> Handle(GetCommentsByPostIdQuery request, CancellationToken cancellationToken)
    {
        var post = await _postsRepository.GetValue(x => x.Id.ToString() == request.PostId)
            ?? throw new NotFoundException($"Post with Id '{request.PostId}' was not found.");

        var comments = _commentRepository.GetCommentsByPostId(
            post.Id.ToString(),
            request.SortColumn,
            request.SortOrder
        );

        return await PagedList<CommentDto>.CreatePageList(comments, request.Page, request.PageSize);
    }
}