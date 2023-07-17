using MediatR;

namespace Blog.Commons.CQRS;

public interface IQueryHandler<in TRequest, TResult> : IRequestHandler<TRequest, TResult>
    where TRequest : IQuery<TResult>
    where TResult : notnull
{
    
}