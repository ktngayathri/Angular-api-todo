import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TODO_TITLE_MAX_LENGTH } from '../todo';

function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { blank: true };
}

/** Presentational: captures a new title and emits it. Knows nothing about HTTP. */
@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
})
export class TodoForm {
  readonly disabled = input(false);
  readonly add = output<string>();

  protected readonly maxLength = TODO_TITLE_MAX_LENGTH;
  protected readonly form = inject(NonNullableFormBuilder).group({
    title: ['', [notBlank, Validators.maxLength(TODO_TITLE_MAX_LENGTH)]],
  });

  protected submit(): void {
    if (this.form.invalid || this.disabled()) {
      return;
    }
    this.add.emit(this.form.controls.title.value.trim());
  }

  /** Called by the parent once the item has been saved successfully. */
  clear(): void {
    this.form.reset();
  }
}
