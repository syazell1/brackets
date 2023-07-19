using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("like_comment")]
public class LikeComment : BaseEntity
{
    [Column("comment_id")]
    public Guid CommentId { get; set; } 
    public Comment? Comment { get; set; }
    [Column("user_id")]
    public Guid UserId { get; set; }
    public User? User { get; set; }
}