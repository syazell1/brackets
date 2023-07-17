using MediatR;

namespace Blog.Commons.CQRS;

public interface IQuery<out TResult>: IRequest<TResult> where TResult : notnull
{
    
}