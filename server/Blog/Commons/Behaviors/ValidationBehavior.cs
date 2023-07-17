using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using ValidationException = Blog.Commons.Exceptions.ValidationException; 

namespace Blog.Commons.Behaviors;

public sealed class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    private readonly ILogger<ValidationBehavior<TRequest, TResponse>> _logger;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators, ILogger<ValidationBehavior<TRequest, TResponse>> logger)
    {
        _validators = validators;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if(_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);

            var results = await Task.WhenAll(_validators.Select(p => p.ValidateAsync(context, cancellationToken))); 

            var failures = results.SelectMany(p => p.Errors).Where(f => f != null).ToList();

            if(failures.Count > 0)
            {
                throw new ValidationException(failures);
            }
        }

        return await next();
    }
}
