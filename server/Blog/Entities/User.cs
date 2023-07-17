using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("users")]
public sealed class User : BaseEntity
{
    public required string Username { get; set; } 
    public required string Password { get; set; }
    public required string Salt { get; set; }
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public UsersInfo? UsersInfo { get; set; }
}