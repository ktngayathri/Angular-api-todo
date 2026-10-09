import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { aTodo } from '../../testing/todo-fixtures';
import { TodoApi } from './todo-api';
import { TodoStore } from './todo-store';

describe('TodoStore', () => {
  const existing = aTodo({ id: '1', title: 'Existing' });
  let api: { getAll: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let store: TodoStore;

  beforeEach(() => {
    api = { getAll: vi.fn(), create: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({
      providers: [TodoStore, { provide: TodoApi, useValue: api }],
    });
    store = TestBed.inject(TodoStore);
  });

  async function seed(): Promise<void> {
    api.getAll.mockReturnValue(of([existing]));
    await store.load();
  }

  describe('load()', () => {
    it('populates todos and clears the loading flag', async () => {
      await seed();

      expect(store.todos()).toEqual([existing]);
      expect(store.count()).toBe(1);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('sets an error when the request fails', async () => {
      api.getAll.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

      await store.load();

      expect(store.todos()).toEqual([]);
      expect(store.error()).toContain('Could not load');
      expect(store.loading()).toBe(false);
    });
  });

  describe('add()', () => {
    it('sends the trimmed title and appends the created item', async () => {
      await seed();
      const created = aTodo({ id: '2', title: 'Walk the dog' });
      api.create.mockReturnValue(of(created));

      const result = await store.add('  Walk the dog  ');

      expect(result).toBe(true);
      expect(api.create).toHaveBeenCalledWith({ title: 'Walk the dog' });
      expect(store.todos()).toEqual([existing, created]);
      expect(store.saving()).toBe(false);
    });

    it('ignores blank titles without calling the API', async () => {
      const result = await store.add('   ');

      expect(result).toBe(false);
      expect(api.create).not.toHaveBeenCalled();
    });

    it('returns false and sets an error when the request fails', async () => {
      api.create.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

      const result = await store.add('Walk the dog');

      expect(result).toBe(false);
      expect(store.error()).toContain('Could not add');
      expect(store.saving()).toBe(false);
    });
  });

  describe('remove()', () => {
    it('removes the item after the API confirms deletion', async () => {
      await seed();
      api.delete.mockReturnValue(of(null));

      await store.remove('1');

      expect(api.delete).toHaveBeenCalledWith('1');
      expect(store.todos()).toEqual([]);
    });

    it('treats a 404 as already deleted', async () => {
      await seed();
      api.delete.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

      await store.remove('1');

      expect(store.todos()).toEqual([]);
      expect(store.error()).toBeNull();
    });

    it('keeps the item and sets an error on other failures', async () => {
      await seed();
      api.delete.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

      await store.remove('1');

      expect(store.todos()).toEqual([existing]);
      expect(store.error()).toContain('Could not delete');
    });
  });
});
