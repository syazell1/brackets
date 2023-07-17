using System.ComponentModel.DataAnnotations.Schema;
using Blog.Commons.Models;

namespace Blog.Entities;

[Table("users_info")]
public sealed class UsersInfo : BaseEntity
{
    [Column("first_name")]
    public string? FirstName { get; set; }
    [Column("last_name")]
    public string? LastName { get; set; }
    [Column("email")]
    public string? Email { get; set; }
    [Column("bio")]
    public string? Bio { get; set; }
    [Column("user_id")]
    public Guid UserId { get; set; }
    public User? User{ get; set; }
}