using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Comments.Interfaces;
using MediatR;

namespace Blog.Features.Comments.Commands.DeleteComment.v1;

sealed class DeleteCommentCommandHandler : ICommandHandler<DeleteCommentCommand, Unit>
{
    private readonly ICommentRepository _commentRepository;
    private readonly ICurrentUserService _currentUserService;
    public DeleteCommentCommandHandler(ICommentRepository commentRepository, ICurrentUserService currentUserService)
    {
        _commentRepository = commentRepository;
        _currentUserService = currentUserService;
    }
    public async Task<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetValue(
            x => x.Id.ToString() == request.CommentId &&
            x.OwnerId.ToString() == _currentUserService.UserId)
            ?? throw new NotFoundException($"Comment with Id '{request.CommentId}' was not found.");

        _commentRepository.Delete(comment); 
        await _commentRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}