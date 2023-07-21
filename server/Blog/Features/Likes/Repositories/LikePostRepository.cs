using Blog.Entities;
using Blog.Features.Likes.Interfaces;
using Blog.Persistence;

namespace Blog.Features.Likes.Repositories;

public sealed class LikePostRepository : RepositoryBase<LikePost>, ILikePostRepository
{
    public LikePostRepository(ApplicationDbContext context) : base(context)
    {
    }
}