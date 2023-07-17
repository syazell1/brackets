using FluentValidation.Results;

namespace Blog.Commons.Exceptions;

public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors;
    public ValidationException() : base("One or more validation error has occured.")
    {
        Errors = new Dictionary<string, string[]>();
    }
    public ValidationException(IEnumerable<ValidationFailure> failures) : this()
    {
        Errors = failures
            .GroupBy(x => x.PropertyName, x => x.ErrorMessage)
            .ToDictionary(p => p.Key, p => p.ToArray());
    }
}
