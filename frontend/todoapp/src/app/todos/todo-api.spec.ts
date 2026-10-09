import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { aTodo } from '../../testing/todo-fixtures';
import { Todo } from './todo';
import { TODO_API_URL, TodoApi } from './todo-api';

describe('TodoApi', () => {
  let api: TodoApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(TodoApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll() sends GET to the base URL and returns the items', () => {
    const todos = [aTodo()];
    let result: Todo[] | undefined;

    api.getAll().subscribe((value) => (result = value));
    const req = http.expectOne('/api/todos');
    req.flush(todos);

    expect(req.request.method).toBe('GET');
    expect(result).toEqual(todos);
  });

  it('create() sends POST with the request body', () => {
    const created = aTodo({ title: 'Walk the dog' });
    let result: Todo | undefined;

    api.create({ title: 'Walk the dog' }).subscribe((value) => (result = value));
    const req = http.expectOne('/api/todos');
    req.flush(created, { status: 201, statusText: 'Created' });

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Walk the dog' });
    expect(result).toEqual(created);
  });

  it('delete() sends DELETE to the item URL with the id encoded', () => {
    api.delete('a/b').subscribe();
    const req = http.expectOne('/api/todos/a%2Fb');
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(req.request.method).toBe('DELETE');
  });

  it('uses the configured TODO_API_URL', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TODO_API_URL, useValue: 'https://example.test/todos' },
      ],
    });
    const customApi = TestBed.inject(TodoApi);
    const customHttp = TestBed.inject(HttpTestingController);

    customApi.getAll().subscribe();
    customHttp.expectOne('https://example.test/todos').flush([]);
    customHttp.verify();
  });
});
