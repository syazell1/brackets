using Blog.Commons.Interfaces;
using Blog.Entities;
using Blog.Features.Users.Dtos;

namespace Blog.Features.Users.Interfaces;

public interface IUsersInfoRepository : IWriteRepository<UsersInfo>, IReadRepository<UsersInfo>
{
}