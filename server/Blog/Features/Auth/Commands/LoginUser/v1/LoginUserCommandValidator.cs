using FluentValidation;

namespace Blog.Features.Auth.Commands.LoginUser.v1;

public sealed class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    public LoginUserCommandValidator()
    {
        RuleFor(x => x.Username) 
            .MinimumLength(4)
            .MaximumLength(12)
            .NotNull()
            .NotEmpty();

        
        RuleFor(x => x.Password) 
            .MinimumLength(4)
            .MaximumLength(12)
            .NotNull()
            .NotEmpty();
    } 
}