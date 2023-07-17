using Blog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Persistence.Configurations;

public class PostTagConfig : IEntityTypeConfiguration<PostTag>
{
    public void Configure(EntityTypeBuilder<PostTag> builder)
    {
        builder
            .HasOne(x => x.Post)
            .WithMany(x => x.PostTags)
            .HasForeignKey(x => x.PostId);

        builder
            .HasOne(x => x.Tag)
            .WithMany(x => x.PostTags)
            .HasForeignKey(x => x.TagId);
    }
}