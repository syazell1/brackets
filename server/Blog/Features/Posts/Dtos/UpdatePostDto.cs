namespace Blog.Features.Posts.Dtos;

public sealed class UpdatePostDto
{
    public required string Title { get; set; } 
    public required string Content { get; set; }
}