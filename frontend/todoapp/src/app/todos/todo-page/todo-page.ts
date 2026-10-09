import { ChangeDetectionStrategy, Component, OnInit, inject, viewChild } from '@angular/core';
import { TodoForm } from '../todo-form/todo-form';
import { TodoList } from '../todo-list/todo-list';
import { TodoStore } from '../todo-store';

/** Container: wires the store to the presentational components. */
@Component({
  selector: 'app-todo-page',
  imports: [TodoForm, TodoList],
  providers: [TodoStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage implements OnInit {
  protected readonly store = inject(TodoStore);
  private readonly form = viewChild.required(TodoForm);

  ngOnInit(): void {
    void this.store.load();
  }

  protected async onAdd(title: string): Promise<void> {
    if (await this.store.add(title)) {
      this.form().clear();
    }
  }

  protected onRemove(id: string): void {
    void this.store.remove(id);
  }
}
