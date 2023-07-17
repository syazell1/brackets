using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("tags")]
public sealed class Tag : BaseEntity
{
    [Column("name")]
    public required string Name { get; set; }
    public ICollection<PostTag> PostTags { get; set; }  = new List<PostTag>();
}