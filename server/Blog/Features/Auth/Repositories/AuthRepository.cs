using Blog.Entities;
using Blog.Features.Auth.Interfaces;
using Blog.Persistence;

namespace Blog.Features.Auth.Repositories;

public sealed class AuthRepository : RepositoryBase<User>, IAuthRepository
{
    public AuthRepository(ApplicationDbContext context) : base(context)
    {
    }
}