using System.Linq.Expressions;
using Blog.Commons.Models;

public interface IReadRepository<T> where T : BaseEntity
{
    Task<T?> GetValue(Expression<Func<T, bool>> expression, bool AsNoTracking = true);
    Task<TResponse?> GetValue<TResponse>(Expression<Func<T, bool>> expression, Expression<Func<T, TResponse>> selector, bool AsNoTracking = true);
    Task<IEnumerable<T>> GetAllValues(bool AsNoTracking = true);
    Task<IEnumerable<T>> GetAllValuesByExp(Expression<Func<T, bool>> expression, bool AsNoTracking = true);
    Task<IEnumerable<T>> GetAllValuesByExp(Expression<Func<T, bool>> expression, List<Expression<Func<T, object>>>? includes = null, bool AsNoTracking = true); 
}