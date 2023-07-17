using MediatR;

namespace Blog.Commons.CQRS;

public interface ICommandHandler<in TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
    where TRequest : ICommand<TResponse>
    where TResponse : notnull
{
    
}