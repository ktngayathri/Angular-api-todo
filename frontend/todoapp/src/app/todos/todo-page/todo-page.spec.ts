import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { aTodo } from '../../../testing/todo-fixtures';
import { TodoPage } from './todo-page';

/**
 * Integration test: real store, real API service and real child components;
 * only the HTTP backend is faked.
 *
 * Note: whenStable() also waits for in-flight HTTP requests, so it must only be
 * awaited after the pending request has been flushed.
 */
describe('TodoPage', () => {
  let fixture: ComponentFixture<TodoPage>;
  let element: HTMLElement;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TodoPage);
    element = fixture.nativeElement;
    fixture.detectChanges(); // triggers ngOnInit -> GET /api/todos
  });

  afterEach(() => http.verify());

  /** Lets pending promise continuations run, then waits for change detection. */
  async function settle(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  const titles = () => Array.from(element.querySelectorAll('li .title')).map((el) => el.textContent?.trim());

  it('loads and renders the TODO list on init', async () => {
    http.expectOne('/api/todos').flush([aTodo({ title: 'Buy milk' })]);
    await settle();

    expect(titles()).toEqual(['Buy milk']);
    expect(element.querySelector('.count')?.textContent).toContain('1 item(s)');
  });

  it('shows an error when the list cannot be loaded', async () => {
    http.expectOne('/api/todos').flush(null, { status: 500, statusText: 'Server Error' });
    await settle();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Could not load');
  });

  it('adds an item and clears the input', async () => {
    http.expectOne('/api/todos').flush([]);
    await settle();

    const input = element.querySelector('input') as HTMLInputElement;
    input.value = 'Walk the dog';
    input.dispatchEvent(new Event('input'));
    element.querySelector('form')!.dispatchEvent(new Event('submit'));

    const post = http.expectOne({ method: 'POST', url: '/api/todos' });
    expect(post.request.body).toEqual({ title: 'Walk the dog' });
    post.flush(aTodo({ id: '2', title: 'Walk the dog' }), { status: 201, statusText: 'Created' });
    await settle();

    expect(titles()).toEqual(['Walk the dog']);
    expect(input.value).toBe('');
  });

  it('deletes an item', async () => {
    http.expectOne('/api/todos').flush([aTodo({ id: '1', title: 'Buy milk' })]);
    await settle();

    (element.querySelector('button.delete') as HTMLButtonElement).click();
    http.expectOne({ method: 'DELETE', url: '/api/todos/1' }).flush(null, { status: 204, statusText: 'No Content' });
    await settle();

    expect(titles()).toEqual([]);
    expect(element.querySelector('.empty')).not.toBeNull();
  });
});
