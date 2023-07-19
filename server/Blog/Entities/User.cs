using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("users")]
public sealed class User : BaseEntity
{
    [Column("username")]
    public required string Username { get; set; }
    [Column("password")]
    public required string Password { get; set; }
    [Column("salt")]
    public required string Salt { get; set; }
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public UsersInfo? UsersInfo { get; set; }
    public ICollection<LikePost> LikedPosts { get; set; } = new List<LikePost>();
    public ICollection<LikeComment> LikedComments { get; set; } = new List<LikeComment>();
}