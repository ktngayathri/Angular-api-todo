using TodoApi.Model;
using TodoApi.Services;
using TodoApi.Validation;
using TodoApi.Repository;

namespace TodoApi.Services;

public static class TodoServiceCollectionExtensions
{
    public static IServiceCollection AddTodos(this IServiceCollection services)
    {
        // Singleton so the in-memory data survives across requests.
        services.AddSingleton<ITodoRepository, TodoRepository>();
        services.AddScoped<TodoService>();
        return services;
    }
}
