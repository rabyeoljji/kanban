import { Todo } from "../type";

export default function tagTemplate({ tags, todoId }: { tags: Todo["tags"]; todoId: string }) {
  return `
  <div class="tags">
  ${
    tags &&
    tags
      .map(({ id, content }) => {
        return `
      <span class="tag" id="tag-${todoId}">
        ${content}
        <button class="delete-tag delete-btn" id="todo-delete-${id}">x</button>
      </span>
      `;
      })
      .join("")
  }

  <div class="tag add-tag-btn">
    <span contentEditable>태그</span>
    <button class="add-btn" id="todo-${todoId}">+</button>
  </div>

</div>
  `;
}
