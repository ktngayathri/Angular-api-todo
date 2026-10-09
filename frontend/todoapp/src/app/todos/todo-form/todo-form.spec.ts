import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  let fixture: ComponentFixture<TodoForm>;
  let element: HTMLElement;
  let emitted: string[];

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TodoForm] });
    fixture = TestBed.createComponent(TodoForm);
    element = fixture.nativeElement;
    emitted = [];
    fixture.componentInstance.add.subscribe((title) => emitted.push(title));
    await fixture.whenStable();
  });

  const input = () => element.querySelector('input') as HTMLInputElement;
  const button = () => element.querySelector('button') as HTMLButtonElement;
  const submit = () => element.querySelector('form')!.dispatchEvent(new Event('submit'));

  async function type(value: string): Promise<void> {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('disables the Add button while the title is empty or blank', async () => {
    expect(button().disabled).toBe(true);

    await type('   ');

    expect(button().disabled).toBe(true);
  });

  it('enables the Add button for a valid title', async () => {
    await type('Buy milk');

    expect(button().disabled).toBe(false);
  });

  it('emits the trimmed title on submit', async () => {
    await type('  Buy milk  ');

    submit();

    expect(emitted).toEqual(['Buy milk']);
  });

  it('does not emit for a blank title', async () => {
    await type('   ');

    submit();

    expect(emitted).toEqual([]);
  });

  it('does not emit while disabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    await type('Buy milk');

    submit();

    expect(emitted).toEqual([]);
    expect(button().disabled).toBe(true);
  });

  it('clear() empties the input', async () => {
    await type('Buy milk');

    fixture.componentInstance.clear();
    await fixture.whenStable();

    expect(input().value).toBe('');
  });
});
