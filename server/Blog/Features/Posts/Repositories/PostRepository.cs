using System.Linq.Expressions;
using Blog.Entities;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Interfaces;
using Blog.Features.Users.Dtos;
using Blog.Persistence;
using Microsoft.EntityFrameworkCore;

public sealed class PostRepository : RepositoryBase<Post>, IPostRepository
{
    public PostRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<PostsDto?> GetPostById(string Id)
    {
        IQueryable<Post> query = _context.Posts
            .AsNoTracking()
            .Include(x => x.Owner)
            .Include(x => x.Likes)
            .Include(x => x.Comments);
            

        return await query
            .Where(x => x.Id.ToString() == Id)
            .Select(x => new PostsDto(
                x.Id,
                x.Title,
                x.Content,
                x.Likes.Count,
                x.Comments.Count,
                new UserDto(x.OwnerId, x.Owner!.Username),
                x.CreatedAt
            ))
            .FirstOrDefaultAsync();
    }

    public IQueryable<PostsDto> GetPosts(
        string? search,
        string? sortColumn,
        string? sortOrder
    )
    {
        IQueryable<Post> query = _context.Posts
            .AsNoTracking()
            .Include(x => x.Owner)
            .Include(x => x.Likes)
            .Include(x => x.Comments);

        if(!string.IsNullOrEmpty(search))
           query = query.Where(x => x.Title.ToLower().Contains(search.ToLower())); 

        if(sortOrder?.ToLower() == "desc")
        {
            query = query.OrderByDescending(GetColumn(sortColumn));
        }
        else 
        {
            query = query.OrderBy(GetColumn(sortColumn));
        }

        return query.Select(x => new PostsDto(
            x.Id,
            x.Title,
            x.Content,
            x.Likes.Count,
            x.Comments.Count,
            new UserDto(x.OwnerId, x.Owner!.Username),
            x.CreatedAt
        ));
    }

    public IQueryable<PostsDto> GetPostsByOwnerId(string ownerId, string? search, string? sortColumn, string? sortOrder)
    {
        IQueryable<Post> query = _context.Posts
            .AsNoTracking()
            .Include(x => x.Owner)
            .Include(x => x.Likes)
            .Include(x => x.Comments)
            .Where(x => x.OwnerId.ToString() == ownerId);

        if(!string.IsNullOrEmpty(search))
           query = query.Where(x => x.Title.ToLower().Contains(search.ToLower())); 

        if(sortOrder?.ToLower() == "desc")
        {
            query = query.OrderByDescending(GetColumn(sortColumn));
        }
        else 
        {
            query = query.OrderBy(GetColumn(sortColumn));
        }

        return query.Select(x => new PostsDto(
            x.Id,
            x.Title,
            x.Content,
            x.Likes.Count,
            x.Comments.Count,
            new UserDto(x.OwnerId, x.Owner!.Username),
            x.CreatedAt
        ));
    }

    public IQueryable<PostsDto> GetPostsByOwnerName(string ownerName, string? search, string? sortColumn, string? sortOrder)
    {
        IQueryable<Post> query = _context.Posts
            .AsNoTracking()
            .Include(x => x.Owner)
            .Include(x => x.Likes)
            .Include(x => x.Comments)
            .Where(x => x.Owner!.Username.ToLower() == ownerName.ToLower());

        if(!string.IsNullOrEmpty(search))
           query = query.Where(x => x.Title.ToLower().Contains(search.ToLower())); 

        if(sortOrder?.ToLower() == "desc")
        {
            query = query.OrderByDescending(GetColumn(sortColumn));
        }
        else 
        {
            query = query.OrderBy(GetColumn(sortColumn));
        }

        return query.Select(x => new PostsDto(
            x.Id,
            x.Title,
            x.Content,
            x.Likes.Count,
            x.Comments.Count,
            new UserDto(x.OwnerId, x.Owner!.Username),
            x.CreatedAt
        ));
    }

    private Expression<Func<Post, object>> GetColumn(string? sortColumn)
    {
        return sortColumn?.ToLower() switch {
            "title" => post => post.Title,
            _ => post => post.CreatedAt
        };
    }
}