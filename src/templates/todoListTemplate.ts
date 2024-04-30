import { Todo } from "../type";
import tagTemplate from "./tagTemplate";

export function todoListTemplate({
  todoId,
  title,
  content,
  tags,
}: {
  todoId: Todo["id"];
  title: Todo["content"]["title"];
  content: Todo["content"];
  tags: Todo["tags"];
}) {
  return `
  <section class="todo" id="${title}-${todoId}">
    <div class="todo-item">
      <div class="wrapper">
        <div class="item-header">
          <div class="item-title">
            <span class="item-title-icon"><i class='bx bxs-inbox'></i></span>
            <div class="title">${content ? content.title : ""}</div>
          </div>
          <div class="todo-control">
            <button class="delete-item" id="delete-todo-${todoId}">
              <span class="delete-btn">x</span>
            </button>
          </div>
        </div>

        <div class="todo-content">${content ? content.body : ""}</div>
      </div>

      ${tagTemplate({ tags, todoId })}
    </div>
  </section>
  `;
}
