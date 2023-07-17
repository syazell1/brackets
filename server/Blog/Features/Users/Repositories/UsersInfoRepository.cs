using Blog.Entities;
using Blog.Features.Users.Interfaces;
using Blog.Persistence;

namespace Blog.Features.Users.Repositories;

public sealed class UsersInfoRepository : RepositoryBase<UsersInfo>, IUsersInfoRepository
{
    public UsersInfoRepository(ApplicationDbContext context) : base(context)
    {
    }
}