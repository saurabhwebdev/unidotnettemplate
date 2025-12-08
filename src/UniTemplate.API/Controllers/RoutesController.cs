using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace UniTemplate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IActionDescriptorCollectionProvider _actionDescriptorCollectionProvider;

    public RoutesController(IActionDescriptorCollectionProvider actionDescriptorCollectionProvider)
    {
        _actionDescriptorCollectionProvider = actionDescriptorCollectionProvider;
    }

    [HttpGet]
    public IActionResult GetAllRoutes()
    {
        var routes = _actionDescriptorCollectionProvider.ActionDescriptors.Items
            .Where(ad => ad is ControllerActionDescriptor)
            .Cast<ControllerActionDescriptor>()
            .Select(ad => new
            {
                Route = $"/api/{ad.ControllerName.ToLower()}" +
                       (ad.AttributeRouteInfo?.Template?.Replace($"api/{ad.ControllerName}", "") ?? ""),
                Method = ad.ActionName switch
                {
                    var name when name.StartsWith("Get") => "GET",
                    var name when name.StartsWith("Create") || name.StartsWith("Post") => "POST",
                    var name when name.StartsWith("Update") || name.StartsWith("Put") => "PUT",
                    var name when name.StartsWith("Delete") => "DELETE",
                    _ => GetHttpMethodFromAttributes(ad)
                },
                Description = GenerateDescription(ad),
                Controller = ad.ControllerName,
                Action = ad.ActionName
            })
            .Where(r => !string.IsNullOrEmpty(r.Method))
            .GroupBy(r => new { r.Route, r.Method })
            .Select(g => g.First())
            .OrderBy(r => r.Route)
            .ThenBy(r => r.Method)
            .ToList();

        return Ok(routes);
    }

    private string GetHttpMethodFromAttributes(ControllerActionDescriptor descriptor)
    {
        var httpMethodAttribute = descriptor.MethodInfo
            .GetCustomAttributes(true)
            .FirstOrDefault(attr =>
                attr.GetType().Name.StartsWith("Http") &&
                attr.GetType().Name != "HttpMethodAttribute");

        return httpMethodAttribute?.GetType().Name.Replace("Http", "").Replace("Attribute", "").ToUpper() ?? "GET";
    }

    private string GenerateDescription(ControllerActionDescriptor descriptor)
    {
        var controller = descriptor.ControllerName;
        var action = descriptor.ActionName;

        // Generate user-friendly descriptions
        if (action.StartsWith("Get"))
        {
            if (action.Contains("All") || action == "Get")
                return $"View all {controller.ToLower()}";
            if (action.Contains("ById") || action.Contains("{id}"))
                return $"View {controller.ToLower().TrimEnd('s')} details";
            return $"Get {action.Replace("Get", "").ToLower()} from {controller.ToLower()}";
        }
        else if (action.StartsWith("Create") || action.StartsWith("Post"))
        {
            return $"Create {controller.ToLower().TrimEnd('s')}";
        }
        else if (action.StartsWith("Update") || action.StartsWith("Put"))
        {
            return $"Update {controller.ToLower().TrimEnd('s')}";
        }
        else if (action.StartsWith("Delete"))
        {
            return $"Delete {controller.ToLower().TrimEnd('s')}";
        }
        else if (action.Contains("Assign"))
        {
            return $"Assign roles to {controller.ToLower().TrimEnd('s')}";
        }

        return $"{action} on {controller.ToLower()}";
    }
}
