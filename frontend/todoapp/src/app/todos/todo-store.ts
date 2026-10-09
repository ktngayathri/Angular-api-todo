import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Todo } from './todo';
import { TodoApi } from './todo-api';

/**
 * Signal-based state for the TODO feature. Components read signals and call
 * intent methods; only the store talks to the API.
 */
@Injectable()
export class TodoStore {
  private readonly api = inject(TodoApi);

  private readonly _todos = signal<readonly Todo[]>([]);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly todos = this._todos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._todos().length);

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._todos.set(await firstValueFrom(this.api.getAll()));
    } catch {
      this._error.set('Could not load your TODO list. Please try again.');
    } finally {
      this._loading.set(false);
    }
  }

  /** @returns true when the item was created. */
  async add(title: string): Promise<boolean> {
    const trimmed = title.trim();
    if (!trimmed) {
      return false;
    }

    this._saving.set(true);
    this._error.set(null);
    try {
      const created = await firstValueFrom(this.api.create({ title: trimmed }));
      this._todos.update((todos) => [...todos, created]);
      return true;
    } catch {
      this._error.set('Could not add the item. Please try again.');
      return false;
    } finally {
      this._saving.set(false);
    }
  }

  async remove(id: string): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.api.delete(id), { defaultValue: undefined });
      this.removeLocally(id);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotFound) {
        // Already gone on the server – keep the UI consistent.
        this.removeLocally(id);
        return;
      }
      this._error.set('Could not delete the item. Please try again.');
    }
  }

  private removeLocally(id: string): void {
    this._todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }
}
