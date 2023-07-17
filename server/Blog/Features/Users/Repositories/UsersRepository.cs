using Blog.Entities;
using Blog.Features.Users.Dtos;
using Blog.Features.Users.Interfaces;
using Blog.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Blog.Features.Users.Repositories;

public sealed class UsersRepository : RepositoryBase<User>, IUsersRepository
{
    public UsersRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<UserDetailsDto?> GetUserInfoByUsername(string Username)
    {
        return await _context.Users 
            .AsNoTracking()
            .Include(x => x.UsersInfo)
            .Where(x => x.Username.ToLower() == Username.ToLower())
            .Select(x => new UserDetailsDto(
                x.Id,
                x.Username,
                x.UsersInfo!.FirstName,
                x.UsersInfo!.LastName,
                x.UsersInfo!.Email,
                x.UsersInfo!.Bio,
                x.CreatedAt
            ))
            .FirstOrDefaultAsync();
    }
}