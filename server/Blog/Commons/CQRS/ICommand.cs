using MediatR;

namespace Blog.Commons.CQRS;

public interface ICommand<out TResult> : IRequest<TResult> where TResult : notnull
{
    
}