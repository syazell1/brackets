using Microsoft.EntityFrameworkCore;

namespace Blog.Commons.Models;

public sealed class PagedList<T>
{
    public IEnumerable<T> Results { get; set; }
    public PageMetadata PageData { get; set; }

    private PagedList(IEnumerable<T> results, PageMetadata pageData)
    {
        Results = results;
        PageData = pageData; 
    }

    public static async Task<PagedList<T>> CreatePageList(IQueryable<T> query, int page, int pageSize)
    {
        var result = await query
            .Skip(pageSize * (page -1))
            .Take(pageSize)
            .ToListAsync();

        var totalItemsCount = await query.CountAsync();
        
        PageMetadata pageData = new(page, pageSize, totalItemsCount);

        return new PagedList<T>(result, pageData);
    }
}