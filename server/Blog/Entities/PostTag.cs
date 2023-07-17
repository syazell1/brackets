using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("post_tag")]
public sealed class PostTag : BaseEntity
{
    [Column("tag_id")]
    public Guid TagId { get; set; } 
    public Tag? Tag { get; set; }
    [Column("post_id")]
    public Guid PostId { get; set; }
    public Post? Post { get; set; }
}