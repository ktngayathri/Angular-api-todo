namespace TodoApi.Model;

/// <summary>Request body for creating a TODO item.</summary>
public sealed record CreateTodoRequest(string? Title);

/// <summary>Public representation of a TODO item returned by the API.</summary>
public sealed record TodoResponse(Guid Id, string Title, DateTimeOffset CreatedAt)
{
    public static TodoResponse From(TodoItem item) => new(item.Id, item.Title, item.CreatedAt);
}
