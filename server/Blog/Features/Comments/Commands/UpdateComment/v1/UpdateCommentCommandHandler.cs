using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Comments.Dtos;
using Blog.Features.Comments.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ValidationException = Blog.Commons.Exceptions.ValidationException;

namespace Blog.Features.Comments.Commands.UpdateComment.v1;

sealed class UpdateCommentCommandHandler : ICommandHandler<UpdateCommentCommand, Unit>
{
    private readonly ICommentRepository _commentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IValidator<UpdateCommentDto> _validator;
    public UpdateCommentCommandHandler(ICommentRepository commentRepository, ICurrentUserService currentUserService, IValidator<UpdateCommentDto> validator)
    {
        _commentRepository = commentRepository;
        _currentUserService = currentUserService;
        _validator = validator;
    }
    public async Task<Unit> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetValue(
            x => x.Id.ToString() == request.CommentId &&
            x.OwnerId.ToString() == _currentUserService.UserId,
            false
        )
            ?? throw new NotFoundException($"Comment with Id '{request.CommentId}' was not found.");

        UpdateCommentDto commentToUpdate = new()
        {
            Content = comment.Content
        };

        request.UpdateComment.ApplyTo(commentToUpdate, (err) => {
            throw new ConflictException("Error in JsonPatchDocument " + err.ErrorMessage);
        });

        var validationResults = await _validator.ValidateAsync(commentToUpdate);
        
        if(!validationResults.IsValid)
            throw new ValidationException(validationResults.Errors);

        comment.Content = commentToUpdate.Content;

        await _commentRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}