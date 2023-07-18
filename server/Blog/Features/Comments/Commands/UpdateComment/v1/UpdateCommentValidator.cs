using Blog.Features.Comments.Dtos;
using FluentValidation;

namespace Blog.Features.Comments.Commands.UpdateComment.v1;

public sealed class UpdateCommentValidator : AbstractValidator<UpdateCommentDto>
{
    public UpdateCommentValidator()
    {
        RuleFor(x => x.Content)
            .MinimumLength(8)
            .MaximumLength(150)
            .NotNull()
            .NotEmpty();
    }
}