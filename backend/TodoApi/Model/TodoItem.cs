namespace TodoApi.Model;

/// <summary>Domain model for a single TODO entry.</summary>
public sealed record TodoItem(Guid Id, string Title, DateTimeOffset CreatedAt);
