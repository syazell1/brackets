namespace Blog.Features.Users.Interfaces;

public interface IPasswordService
{
    string HashPassword(string password, out string salt); 

    bool VerifyPassword(string encryptedPassword, string password, string salt);
}