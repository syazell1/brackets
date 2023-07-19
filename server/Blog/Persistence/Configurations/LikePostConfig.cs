using Blog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Persistence.Configurations;

public sealed class LikePostConfig : IEntityTypeConfiguration<LikePost>
{
    public void Configure(EntityTypeBuilder<LikePost> builder)
    {
        builder
            .HasOne(x => x.Post)
            .WithMany(x => x.Likes)
            .HasForeignKey(x => x.PostId);
        
        builder
            .HasOne(x => x.User)
            .WithMany(x => x.LikedPosts)
            .HasForeignKey(x => x.UserId);
    }
}