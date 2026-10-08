using System.Collections.Concurrent;
using TodoApi.Model;
using TodoApi.Services;
using TodoApi.Validation;

namespace TodoApi.Repository;

/// <summary>Thread-safe, process-local store. Data is lost when the API restarts.</summary>
public sealed class TodoRepository: ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _items = new();

    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<TodoItem> items = _items.Values
            .OrderBy(item => item.CreatedAt)
            .ThenBy(item => item.Id)
            .ToList();

        return Task.FromResult(items);
    }

    public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(_items.GetValueOrDefault(id));

    public Task AddAsync(TodoItem item, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(item);

        if (!_items.TryAdd(item.Id, item))
        {
            throw new InvalidOperationException($"A TODO item with id '{item.Id}' already exists.");
        }

        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(_items.TryRemove(id, out _));
}
