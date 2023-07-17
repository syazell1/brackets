using Blog.Commons.Models;

namespace Blog.Commons.Interfaces;

public interface IWriteRepository<T> where T : BaseEntity
{
    Task Add(T entity, CancellationToken cancellationToken = default);
    Task AddRange(IEnumerable<T> entities, CancellationToken cancellationToken = default);
    void Delete(T entity);
    void DeleteRange(IEnumerable<T> entities);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);    
}