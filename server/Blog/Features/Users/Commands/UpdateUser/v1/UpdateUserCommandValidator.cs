using FluentValidation;

namespace Blog.Features.Users.Commands.UpdateUser.v1;

public sealed class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
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

        RuleFor(x => x.FirstName) 
            .MinimumLength(4);

        RuleFor(x => x.LastName) 
            .MinimumLength(4);

         RuleFor(x => x.Email) 
            .EmailAddress();

        RuleFor(x => x.Bio) 
            .MinimumLength(1)
            .MaximumLength(50);
    }    
}