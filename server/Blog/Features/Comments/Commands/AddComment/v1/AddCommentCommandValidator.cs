using FluentValidation;

namespace Blog.Features.Comments.Commands.AddComment.v1;

public class AddCommentCommandValidator : AbstractValidator<AddCommentCommand>
{
    public AddCommentCommandValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty()
            .NotNull();

        RuleFor(x => x.Content)
            .MinimumLength(8)
            .MaximumLength(150)
            .NotNull()
            .NotEmpty();
    } 
}