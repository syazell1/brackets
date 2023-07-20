using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Posts.Dtos;
using Blog.Features.Posts.Interfaces;
using FluentValidation;
using MediatR;
using ValidationException = Blog.Commons.Exceptions.ValidationException;

namespace Blog.Features.Posts.Commands.UpdatePost.v1;

sealed class UpdatePostCommandHandler : ICommandHandler<UpdatePostCommand, Unit>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IValidator<UpdatePostDto> _validator;
    public UpdatePostCommandHandler(IPostRepository postRepository, ICurrentUserService currentUserService, IValidator<UpdatePostDto> validator)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _validator = validator;
    }
    public async Task<Unit> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetValue(
            x => x.Id.ToString() == request.PostId &&
            x.OwnerId.ToString() == _currentUserService.UserId,
            false
        ) ?? throw new NotFoundException($"Post with Id '{request.PostId}' was not found.");

        UpdatePostDto postToUpdate = new()
        {
            Title = post.Title,
            Content = post.Content
        };

        request.UpdatePost.ApplyTo(postToUpdate, (err) => {
            throw new ConflictException("Error in JsonPatchDocument " + err.ErrorMessage);
        });

        var validationResults = await _validator.ValidateAsync(postToUpdate, cancellationToken);

        if(!validationResults.IsValid)
            throw new ValidationException(validationResults.Errors);

        post.Title = postToUpdate.Title;
        post.Content = postToUpdate.Content;

        await _postRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}