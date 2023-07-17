using Blog.Commons.CQRS;
using Blog.Commons.Exceptions;
using Blog.Features.Users.Dtos;
using Blog.Features.Users.Interfaces;

namespace Blog.Features.Users.Queries.GetUserDetailsByUsername.v1;

sealed class GetUserDetailsByUsernameQueryHandler : IQueryHandler<GetUserDetailsByUsernameQuery, UserDetailsDto>
{
    private readonly IUsersRepository _usersRepository;
    public GetUserDetailsByUsernameQueryHandler(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }
    public async Task<UserDetailsDto> Handle(GetUserDetailsByUsernameQuery request, CancellationToken cancellationToken)
    {
        var user = await _usersRepository.GetUserInfoByUsername(request.username)
            ?? throw new NotFoundException($"User with username '{request.username}' was not found.");

        return user;
    }
}