using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Commons.Models;

[ApiController]
[ApiVersion(1.0)]
public abstract class BaseController : ControllerBase
{
    protected readonly IMediator mediator;
    public BaseController(IMediator mediator)
    {
        this.mediator = mediator;
    }
}