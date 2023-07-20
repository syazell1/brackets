using Blog.Commons.Interfaces;
using Blog.Entities;

namespace Blog.Features.Likes.Interfaces;
public interface ILikePostRepository : IWriteRepository<LikePost>, IReadRepository<LikePost>
{

}