export function addTodoTemplate() {
  return `
  <div class="todo-item add-item">
    <div>
      <div class="item-header">
        <div class="item-title">
          <span class="item-title-icon"><i class='bx bxs-inbox'></i></span>
          <div class="title add-title" contentEditable>제목</div>
        </div>
      </div>
      <div class="todo-content add-content" contentEditable>내용</div>

    </div>
    <div class="todo-control">
      <button class="cancel">Cancel</button>
      <button class="add">Add Item</button>
    </div>
  </div>
  `;
}
