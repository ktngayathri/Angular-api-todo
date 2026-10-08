using TodoApi.Model;

namespace TodoApi.Validation;

public static class CreateTodoRequestValidator
{
    public const int MaxTitleLength = 200;

    /// <summary>Returns validation errors keyed by JSON property name; empty when the request is valid.</summary>
    public static Dictionary<string, string[]> Validate(CreateTodoRequest request)
    {
        var errors = new Dictionary<string, string[]>();
        var title = request.Title?.Trim();

        if (string.IsNullOrEmpty(title))
        {
            errors["title"] = ["Title is required."];
        }
        else if (title.Length > MaxTitleLength)
        {
            errors["title"] = [$"Title must be {MaxTitleLength} characters or fewer."];
        }

        return errors;
    }
}
