using Blog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Persistence.Configurations;

public class UsersConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .HasMany(x => x.Posts)
            .WithOne(x => x.Owner)
            .HasForeignKey(x => x.OwnerId);

        builder
            .HasMany(x => x.Comments)
            .WithOne(x => x.Owner)
            .HasForeignKey(x => x.OwnerId);

        builder
            .HasOne(x => x.UsersInfo)
            .WithOne(x => x.User)
            .HasForeignKey<UsersInfo>(x => x.UserId);
    }
}