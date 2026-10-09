import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTodoRequest, Todo } from './todo';

/** Base URL of the TODO API. Relative by default so the dev-server proxy handles routing. */
export const TODO_API_URL = new InjectionToken<string>('TODO_API_URL', {
  providedIn: 'root',
  factory: () => '/api/todos',
});

/** Thin HTTP gateway: no state, no UI concerns. */
@Injectable({ providedIn: 'root' })
export class TodoApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(TODO_API_URL);

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  create(request: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
