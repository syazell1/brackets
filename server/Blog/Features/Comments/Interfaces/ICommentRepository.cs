using Blog.Commons.Interfaces;
using Blog.Entities;
using Blog.Features.Comments.Dtos;

namespace Blog.Features.Comments.Interfaces;

public interface ICommentRepository : IWriteRepository<Comment>, IReadRepository<Comment>
{
    IQueryable<CommentDto> GetCommentsByPostId(
        string PostId, 
        string? sortColumn,
        string? sortOrder
    );

    Task<CommentDetailsDto?> GetCommentDetailsById(string CommentId);
}