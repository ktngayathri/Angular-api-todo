using Microsoft.AspNetCore.Mvc;
using TodoApi.Model;
using TodoApi.Repository;
using TodoApi.Validation;
using TodoApi.Services;
namespace TodoApi.Controllers;

[ApiController]
[Route("api/todos")]
[Produces("application/json")]
public class TodosController : ControllerBase
{
    private const string GetTodoByIdRouteName = "GetTodoById";
    private readonly TodoService _service;

    public TodosController(TodoService service)
    {
        _service = service;
    }

    [HttpGet(Name = "GetTodos")]
    [ProducesResponseType(typeof(TodoResponse[]), StatusCodes.Status200OK)]
    public async Task<ActionResult<TodoResponse[]>> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await _service.GetAllAsync(cancellationToken);
        return Ok(items.Select(TodoResponse.From).ToArray());
    }

    [HttpGet("{id:guid}", Name = "GetTodoById")]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await _service.GetByIdAsync(id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        return Ok(TodoResponse.From(item));
    }

    [HttpPost(Name = "CreateTodo")]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoResponse>> CreateAsync(
        [FromBody] CreateTodoRequest request,
        CancellationToken cancellationToken)
    {
        var errors = CreateTodoRequestValidator.Validate(request);
        if (errors.Count > 0)
        {
            return ValidationProblem(new ValidationProblemDetails(errors));
        }

        var item = await _service.CreateAsync(request.Title!, cancellationToken);

        return CreatedAtRoute(
            GetTodoByIdRouteName,
            new { id = item.Id },
            TodoResponse.From(item));
    }

    [HttpDelete("{id:guid}", Name = "DeleteTodo")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}