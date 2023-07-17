using Blog.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blog.Persistence.IntialData;

public static class TagsInitialData
{
    public static ModelBuilder AddTagsInitialData(this ModelBuilder modelBuilder)
    {
        List<Tag> tags = new()
        {
            new Tag{Id = Guid.NewGuid(), Name = "programming", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "c#", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "sql", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "html", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "css", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "javascript", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "python", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "ci/cd", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "react", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "frontend", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow},
            new Tag{Id = Guid.NewGuid(), Name = "backend", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow}
        };

        modelBuilder.Entity<Tag>().HasData(tags);
        return modelBuilder;    
    }
}