namespace Blog.Features.Users.Dtos;

public sealed record UserDetailsDto(
    Guid Id,
    string Username,
    string? FirstName,
    string? LastName,
    string? Email,
    string? Bio,
    DateTime CreatedAt
);