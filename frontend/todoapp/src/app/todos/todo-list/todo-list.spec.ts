import { ComponentFixture, TestBed } from '@angular/core/testing';
import { aTodo } from '../../../testing/todo-fixtures';
import { TodoList } from './todo-list';

describe('TodoList', () => {
  let fixture: ComponentFixture<TodoList>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TodoList] });
    fixture = TestBed.createComponent(TodoList);
    element = fixture.nativeElement;
  });

  it('shows an empty-state message when there are no items', async () => {
    fixture.componentRef.setInput('todos', []);
    await fixture.whenStable();

    expect(element.querySelector('.empty')?.textContent).toContain('Nothing to do');
    expect(element.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders one row per item', async () => {
    fixture.componentRef.setInput('todos', [
      aTodo({ id: '1', title: 'Buy milk' }),
      aTodo({ id: '2', title: 'Walk the dog' }),
    ]);
    await fixture.whenStable();

    const titles = Array.from(element.querySelectorAll('li .title')).map((el) => el.textContent?.trim());
    expect(titles).toEqual(['Buy milk', 'Walk the dog']);
  });

  it('emits the item id when Delete is clicked', async () => {
    const removed: string[] = [];
    fixture.componentInstance.remove.subscribe((id) => removed.push(id));
    fixture.componentRef.setInput('todos', [aTodo({ id: '42', title: 'Buy milk' })]);
    await fixture.whenStable();

    (element.querySelector('button.delete') as HTMLButtonElement).click();

    expect(removed).toEqual(['42']);
  });

  it('gives each Delete button an accessible name', async () => {
    fixture.componentRef.setInput('todos', [aTodo({ title: 'Buy milk' })]);
    await fixture.whenStable();

    expect(element.querySelector('button.delete')?.getAttribute('aria-label')).toBe('Delete Buy milk');
  });
});
