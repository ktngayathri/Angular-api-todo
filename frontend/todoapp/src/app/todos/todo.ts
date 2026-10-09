/** Mirrors the API's TodoResponse contract. */
export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
}

/** Mirrors the API's CreateTodoRequest contract. */
export interface CreateTodoRequest {
  readonly title: string;
}

/** Keep in sync with CreateTodoRequestValidator.MaxTitleLength on the API. */
export const TODO_TITLE_MAX_LENGTH = 200;
