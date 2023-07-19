using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("post")]
public sealed class Post : BaseEntity
{
    [Column("title")]
    public required string Title { get; set; } 
    [Column("content")]
    public required string Content { get; set; }
    [Column("owner_id")]
    public Guid OwnerId { get; set; }
    public User? Owner { get; set; }
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    public ICollection<LikePost> Likes { get; set; } = new List<LikePost>();
}