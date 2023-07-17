using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("comment")]
public sealed class Comment : BaseEntity
{
    [Column("content")]
    public required string Content { get; set; }
    [Column("post_id")]
    public Guid PostId { get; set; }
    public Post? Post { get; set; }
    [Column("owner_id")]
    public Guid OwnerId { get; set; } 
    public User? Owner { get; set; }
}