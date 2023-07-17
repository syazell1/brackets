using FluentValidation;

namespace Blog.Features.Posts.Commands.CreatePost.v1;

public sealed class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
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