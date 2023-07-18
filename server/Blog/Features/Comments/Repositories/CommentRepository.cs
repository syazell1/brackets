using System.Linq.Expressions;
using Blog.Entities;
using Blog.Features.Comments.Dtos;
using Blog.Features.Comments.Interfaces;
using Blog.Features.Users.Dtos;
using Blog.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Blog.Features.Comments.Repositories;

public sealed class CommentRepository : RepositoryBase<Comment>, ICommentRepository
{
    public CommentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CommentDetailsDto?> GetCommentDetailsById(string CommentId)
    {
        return await _context.Comments
            .AsNoTracking()
            .Include(x => x.Post)
            .Include(x => x.Owner)
            .Where(x => x.Id.ToString() == CommentId)
            .Select(x => new CommentDetailsDto(
                x.Id,
                x.Content,
                new PostInfoDto(
                    x.PostId,
                    x.Post!.Title
                ),
                new UserDto(
                    x.OwnerId,
                    x.Owner!.Username
                ),
                x.CreatedAt
            ))
            .FirstOrDefaultAsync();
    }

    public IQueryable<CommentDto> GetCommentsByPostId(string PostId, string? sortColumn, string? sortOrder)
    {
        IQueryable<Comment> query = _context.Comments
            .AsNoTracking()
            .Include(x => x.Owner)
            .Where(x => x.PostId.ToString() == PostId);

        if(sortOrder?.ToLower() == "desc")
        {
            query = query.OrderByDescending(GetColumn(sortColumn));
        }
        else 
        {
            query = query.OrderBy(GetColumn(sortColumn));
        }

        return query.Select(x => new CommentDto(
            x.Id,
            x.Content,
            x.PostId,
            new UserDto(x.OwnerId, x.Owner!.Username),
            x.CreatedAt
        ));
    }

    private Expression<Func<Comment, object>> GetColumn(string? sortColumn)
    {
        return sortColumn?.ToLower() switch {
            "content" => comment => comment.Content,
            "username" => comment => comment.Owner!.Username,
            _ => comment => comment.CreatedAt
        };
    }
}