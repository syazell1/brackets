using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("like_post")]
public class LikePost : BaseEntity
{
    [Column("post_id")]
    public Guid PostId { get; set; } 
    public Post? Post { get; set; }
    [Column("user_id")]
    public Guid UserId { get; set; }
    public User? User { get; set; }
}