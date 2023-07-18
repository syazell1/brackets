using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Auth.Interfaces;
using Blog.Features.Users.Interfaces;
using MediatR;

namespace Blog.Features.Users.Commands.UpdateUser.v1;

sealed class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand, Unit>
{
    private readonly IUsersRepository _usersRepository;
    private readonly IUsersInfoRepository _usersInfoRepository;
    private readonly ICurrentUserService _currentUserService;
    public UpdateUserCommandHandler(IUsersRepository usersRepository, ICurrentUserService currentUserService, IUsersInfoRepository usersInfoRepository)
    {
        _usersRepository = usersRepository;
        _currentUserService = currentUserService;
        _usersInfoRepository = usersInfoRepository;
    }
    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _usersRepository.GetValue(x => x.Id.ToString() == _currentUserService.UserId, false)
            ?? throw new UnauthorizedAccessException("Invalid User, Please Login Again.");

        
        var usersInfo = await _usersInfoRepository.GetValue(x => x.UserId.ToString() == _currentUserService.UserId, false)
            ?? throw new UnauthorizedAccessException("Invalid User, Please Login Again.");

        var existingUser = await _usersRepository.GetValue(
            x => x.Id.ToString() != _currentUserService.UserId &&
            x.Username.ToLower() == request.Username.ToLower()
        );

        if(existingUser is not null)
            throw new ConflictException("Username already exists.");

        user.Username = request.Username;

        usersInfo.FirstName = request.FirstName;
        usersInfo.LastName = request.LastName;
        usersInfo.Email = request.Email;
        usersInfo.Bio = request.Bio;

        await _usersInfoRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}