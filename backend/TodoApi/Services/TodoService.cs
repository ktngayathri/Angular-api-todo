using TodoApi.Model;
using TodoApi.Repository;
using TodoApi.Validation;

namespace TodoApi.Services;

/// <summary>Application logic for TODO items (id/timestamp generation, normalisation).</summary>
public sealed class TodoService(ITodoRepository repository, TimeProvider timeProvider)
{
    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken cancellationToken = default) =>
        repository.GetAllAsync(cancellationToken);

    public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        repository.GetByIdAsync(id, cancellationToken);

    public async Task<TodoItem> CreateAsync(string title, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        var now = timeProvider.GetUtcNow();
        var item = new TodoItem(Guid.CreateVersion7(now), title.Trim(), now);

        await repository.AddAsync(item, cancellationToken);
        return item;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) =>
        repository.DeleteAsync(id, cancellationToken);
}
