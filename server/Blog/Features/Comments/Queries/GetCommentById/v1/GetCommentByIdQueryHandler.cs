using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Comments.Dtos;
using Blog.Features.Comments.Interfaces;

namespace Blog.Features.Comments.Queries.GetCommentById.v1;

sealed class GetCommentByIdQueryHandler : IQueryHandler<GetCommentByIdQuery, CommentDetailsDto>
{
    private readonly ICommentRepository _commentRepository;
    public GetCommentByIdQueryHandler(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }
    public async Task<CommentDetailsDto> Handle(GetCommentByIdQuery request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetCommentDetailsById(request.CommentId)
            ?? throw new NotFoundException($"Comment with Id '{request.CommentId}' was not found.");

        return comment;
    }
}