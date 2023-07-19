using Blog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Persistence.Configurations;

public sealed class LikeCommentConfig : IEntityTypeConfiguration<LikeComment>
{
    public void Configure(EntityTypeBuilder<LikeComment> builder)
    {
        builder
            .HasOne(x => x.Comment)
            .WithMany(x => x.Likes)
            .HasForeignKey(x => x.CommentId);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.LikedComments)
            .HasForeignKey(x => x.UserId);
    }
}