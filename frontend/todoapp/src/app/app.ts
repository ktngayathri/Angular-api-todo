import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoPage } from './todos/todo-page/todo-page';

@Component({
  selector: 'app-root',
  imports: [TodoPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-todo-page />',
})
export class App {}
