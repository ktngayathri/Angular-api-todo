using TodoApi.Model;
using TodoApi.Repository;
using TodoApi.Validation;

namespace TodoApi.Repository;

/// <summary>
/// Persistence abstraction for TODO items. The in-memory implementation can be
/// swapped for a database-backed one without touching the endpoints or service.
/// </summary>
public interface ITodoRepository
{
    Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task AddAsync(TodoItem item, CancellationToken cancellationToken = default);

    /// <returns><c>true</c> if the item existed and was removed.</returns>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
