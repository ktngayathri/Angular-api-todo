import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Todo } from '../todo';

/** Presentational: renders the items and emits delete intents. */
@Component({
  selector: 'app-todo-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  readonly todos = input.required<readonly Todo[]>();
  readonly remove = output<string>();
}
