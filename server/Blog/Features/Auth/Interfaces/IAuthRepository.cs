using Blog.Commons.Interfaces;
using Blog.Entities;

namespace Blog.Features.Auth.Interfaces;

public interface IAuthRepository : IWriteRepository<User>, IReadRepository<User>
{

}