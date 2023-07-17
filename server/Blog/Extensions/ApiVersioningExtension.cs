using Asp.Versioning;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Extensions;

public static class ApiVersionExtension
{
    public static IServiceCollection AddApiVersionExtension(this IServiceCollection services)
    {
        services.AddApiVersioning(opt =>
            {
                opt.ReportApiVersions = true;
                opt.AssumeDefaultVersionWhenUnspecified = true;
                opt.DefaultApiVersion = new ApiVersion(1, 0);
                opt.ApiVersionReader = new HeaderApiVersionReader("api-version");
            }).AddApiExplorer(
                options =>
                {
                    // add the versioned api explorer, which also adds IApiVersionDescriptionProvider service
                    // note: the specified format code will format the version as "'v'major[.minor][-status]"
                    options.GroupNameFormat = "'v'VVV";
                }).AddMvc();

        return services;
    }
}