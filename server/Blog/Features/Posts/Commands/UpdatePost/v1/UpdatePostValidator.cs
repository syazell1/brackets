using Blog.Features.Posts.Dtos;
using FluentValidation;

namespace Blog.Features.Posts.Commands.UpdatePost.v1;

public sealed class UpdatePostValidator : AbstractValidator<UpdatePostDto>
{
    public UpdatePostValidator()
    {
        RuleFor(x => x.Title)   
            .MinimumLength(8)
            .MaximumLength(50)
            .NotEmpty()
            .NotNull();

        RuleFor(x => x.Content)
            .MinimumLength(8)
            .NotEmpty()
            .NotNull();
    } 
}