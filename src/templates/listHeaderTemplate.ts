import { TodoList } from "../type";

export function listHeaderTemplate({ id, list, title }: TodoList) {
  return `
  <section class="board-title">
    <div class="board-header">
      <div class="total"><span id="todo-count">${list?.length ?? 0}</span></div>
      <h2 class="title" contentEditable>${title}</h2>
    </div>

    <div class="board-control">
      <button class="kanban-delete" id="kanban-${id}"><span class="delete-btn">x</span></button>
    </div>
  </section>
  `;
}
