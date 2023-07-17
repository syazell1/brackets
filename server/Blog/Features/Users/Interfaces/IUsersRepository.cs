using Blog.Commons.Interfaces;
using Blog.Entities;
using Blog.Features.Users.Dtos;

namespace Blog.Features.Users.Interfaces;

public interface IUsersRepository : IWriteRepository<User>, IReadRepository<User>
{
    Task<UserDetailsDto?> GetUserInfoByUsername(string Username);
}