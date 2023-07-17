using System.Linq.Expressions;
using Blog.Commons.Interfaces;
using Blog.Commons.Models;
using Microsoft.EntityFrameworkCore;

namespace Blog.Persistence;

public abstract class RepositoryBase<T> : IWriteRepository<T>, IReadRepository<T> where T : BaseEntity
{
    protected ApplicationDbContext _context;
    public RepositoryBase(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task Add(T entity, CancellationToken cancellationToken = default)
    {
        await _context.Set<T>().AddAsync(entity, cancellationToken);
    }

    public async Task AddRange(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        await _context.Set<T>().AddRangeAsync(entities, cancellationToken);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
    }

    public async Task<IEnumerable<T>> GetAllValues(bool AsNoTracking = true)
    {
        IQueryable<T> query = _context.Set<T>();

        if (AsNoTracking)
            query = query.AsNoTracking();

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<T>> GetAllValuesByExp(Expression<Func<T, bool>> expression, bool AsNoTracking = true)
    {
        IQueryable<T> query = _context.Set<T>();

        if (AsNoTracking)
            query = query.AsNoTracking();

        return await query.Where(expression).ToListAsync();
    }

    public async Task<IEnumerable<T>> GetAllValuesByExp(Expression<Func<T, bool>> expression, List<Expression<Func<T, object>>>? includes = null, bool AsNoTracking = true)
    {
        IQueryable<T> query = _context.Set<T>();

        if (AsNoTracking)
            query = query.AsNoTracking();

        if(includes is not null)
            query = includes.Aggregate(query, (ctx, include ) => ctx.Include(include));

        return await query.Where(expression).ToListAsync();
    }

    public async Task<T?> GetValue(Expression<Func<T, bool>> expression, bool AsNoTracking = true)
    {
        IQueryable<T> query = _context.Set<T>();

        if (AsNoTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(expression);
    }

    public async Task<TResponse?> GetValue<TResponse>(Expression<Func<T, bool>> expression, Expression<Func<T, TResponse>> selector, bool AsNoTracking = true)
    {
        IQueryable<T> query = _context.Set<T>();

        if (AsNoTracking)
            query = query.AsNoTracking();

        return await query.Where(expression).Select(selector).FirstOrDefaultAsync();
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}