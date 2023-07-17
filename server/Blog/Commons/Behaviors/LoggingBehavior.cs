using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Blog.Commons.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull, IRequest<TResponse>
    where TResponse : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        const string prefix = nameof(LoggingBehavior<TRequest, TResponse>);
        var requestName = typeof(TRequest).Name;
        var responseName = typeof(TResponse).Name;

        _logger.LogInformation("[{Prefix}] Handle request={RequestName} and response={ResponseName}",
            prefix, requestName, responseName);

        var timer = new Stopwatch();
        timer.Start();

        var response = await next();

        timer.Stop();
        var timeTaken = timer.Elapsed;
        if (timeTaken.Seconds > 3) // if the request is greater than 3 seconds, then log the warnings
            _logger.LogWarning("[{Perf-Possible}] The request {RequestName} took {@TimeTaken} seconds.",
                prefix, requestName, timeTaken.Seconds);

        _logger.LogInformation("[{Prefix}] Handled {RequestName}", prefix, requestName);
        return response;
    }
}

