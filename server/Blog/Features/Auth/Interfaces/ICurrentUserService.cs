namespace Blog.Features.Auth.Interfaces;

public interface ICurrentUserService
{
    public string? UserId { get; }
}