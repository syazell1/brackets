using Blog.Commons.Interfaces;
using Blog.Entities;
using Blog.Features.Posts.Dtos;

namespace Blog.Features.Posts.Interfaces;

public interface IPostRepository : IWriteRepository<Post>, IReadRepository<Post>
{
    IQueryable<PostsDto> GetPosts(
        string? search,
        string? sortColumn,
        string? sortOrder
    );

    IQueryable<PostsDto> GetPostsByOwnerId(
        string ownerId, 
        string? search,
        string? sortColumn,
        string? sortOrder
    );

    IQueryable<PostsDto> GetPostsByOwnerName(
        string ownerName, 
        string? search,
        string? sortColumn,
        string? sortOrder
    );

    Task<PostsDto?> GetPostById(string Id);
}