import { Tag, Todo, TodoList, inProgressTodo, isButtonElement } from "./type";
import { defaultKanban } from "./mock";
import { v4 as uuidv4 } from "uuid";

import "./index.css";
import { addListButtonTemplate, addTodoTemplate, listHeaderTemplate, todoListTemplate } from "./templates/template";
import { KANBAN_LIST } from "./constants/storageKEY";

class KanbanApp {
  kanban: TodoList[];

  constructor(data: TodoList[]) {
    this.kanban = data;
    this.render();
  }

  // ----------------------- 렌더링 하는 함수
  render() {
    const $addListButton = document.createElement("button");
    $addListButton.classList.add("board", "add");
    $addListButton.innerHTML = `<span class="plus-btn blue">+</span>`;

    const $board = document.querySelector(".todo-container");

    if ($board) {
      $board.innerHTML = "";

      const fragment = document.createDocumentFragment();
      const kanbanElements = this.kanban.map((kanban) => this.generateKanban(kanban));

      fragment.append(...kanbanElements);
      $board.append(fragment, $addListButton);
    }
    this.attachEvent();
    window.localStorage.setItem(KANBAN_LIST, JSON.stringify(this.kanban));
  }

  // ----------------------- 이벤트 함수
  attachEvent() {
    const $addListButton = document.querySelector(".board.add");
    const $removeListButton = document.querySelectorAll(".kanban-delete");

    const $addTodoButton = document.querySelectorAll(".todo-item.add");
    const $removeTodoButton = document.querySelectorAll(".delete-item");

    const $addTagButton = document.querySelectorAll(".add-btn");
    const $removeTagButton = document.querySelectorAll(".delete-tag");

    const $kanbanTitle = document.querySelectorAll(".board-header>h2");

    $kanbanTitle.forEach((kanbanTitle) => {
      (kanbanTitle as HTMLHeadElement).addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          const changedTitle = kanbanTitle.textContent ?? "";
          const kanbanTitleElement = kanbanTitle.closest(".board-title");
          const targetKanbanId = kanbanTitleElement?.querySelector(".kanban-delete")?.id.split("kanban-")[1];
          const targetKanban = this.kanban.find((kanban) => kanban.id === targetKanbanId);
          if (targetKanban) {
            targetKanban.title = changedTitle;
          }

          this.render();
        }
      });
    });

    $addListButton?.addEventListener("click", () => {
      const newId = uuidv4();
      this.kanban = [
        ...this.kanban,
        {
          id: newId,
          title: `kanban-${newId}`,
          list: [],
        },
      ];

      this.render();
    });

    $removeListButton?.forEach((button) => {
      button.addEventListener("click", ({ currentTarget }) => {
        if (currentTarget && isButtonElement(currentTarget)) {
          const [, selectedId] = currentTarget.id.split("kanban-");
          this.removeKanban(selectedId);
        }
      });
    });

    $addTodoButton.forEach((button) => {
      button.addEventListener("click", ({ currentTarget }) => {
        if (currentTarget && isButtonElement(currentTarget)) {
          const [, category] = currentTarget.id.split("add-todo-");
          currentTarget.closest(".wrapper")?.prepend(this.addTodo(category));
        }
      });
    });

    $removeTodoButton.forEach((button) => {
      button.addEventListener("click", ({ currentTarget }) => {
        if (currentTarget && isButtonElement(currentTarget)) {
          const $closestTodo = currentTarget.closest(".todo");
          if (!$closestTodo) {
            console.log("error: closest todo가 존재하지 않습니다");
            return;
          }
          const [category] = $closestTodo.id.split("-");
          const [, selectedId] = currentTarget.id.split("delete-todo-");

          this.removeTodo(selectedId, category);
        }
      });
    });

    $addTagButton.forEach((button) => {
      button.addEventListener("click", ({ currentTarget }) => {
        if (!(currentTarget && isButtonElement(currentTarget))) return;

        const category = currentTarget.closest(".todo")?.id.split("-")[0];
        const selectedId = currentTarget.id.split("todo-")[1];

        const tagContent = currentTarget.closest(".tag")?.querySelector("span")?.textContent ?? "";

        this.addTag({ category, selectedId, tagContent });
      });
    });

    $removeTagButton.forEach((button) => {
      button.addEventListener("click", ({ currentTarget }) => {
        if (!(currentTarget && isButtonElement(currentTarget))) return;

        const category = currentTarget.closest(".todo")?.id.split("-")[0];

        const selectedTodoId = currentTarget.closest(".tag")?.id.split("tag-")[1];
        const selectedTagId = currentTarget.id.split(`todo-delete-`)[1];

        this.removeTag({ category, selectedTagId, selectedTodoId });
      });
    });
  }

  // ----------------------- 태그를 추가하는 함수
  addTag({
    category,
    selectedId,
    tagContent,
  }: {
    category?: Todo["category"];
    selectedId: Todo["id"];
    tagContent?: Tag["content"];
  }) {
    const kanbanId = this.kanban.findIndex((kanban) => kanban.title === category);
    const targetKanban = this.kanban.find((kanban) => kanban.title === category);

    const TodoIndex = targetKanban?.list?.findIndex((todo) => todo.id === selectedId);
    const targetTodo = targetKanban?.list?.find((todo) => todo.id === selectedId);

    targetTodo?.tags?.push({
      id: uuidv4(),
      content: tagContent ?? "태그",
    });

    if (TodoIndex && targetTodo) {
      this.kanban[kanbanId].list?.splice(TodoIndex, 1, targetTodo);
    }

    this.render();
  }

  // ----------------------- 태그를 삭제하는 함수
  removeTag({
    category,
    selectedTagId,
    selectedTodoId,
  }: {
    category?: Todo["category"];
    selectedTagId: Tag["id"];
    selectedTodoId?: Todo["id"];
  }) {
    const kanbanId = this.kanban.findIndex((kanban) => kanban.title === category);
    const targetKanban = this.kanban.find((kanban) => kanban.title === category);

    if (targetKanban) {
      const todo = targetKanban.list?.find((todo) => todo.id === selectedTodoId);
      const todoIndex = targetKanban.list?.findIndex((todo) => todo.id === selectedTodoId) ?? 0;

      const newTags = todo?.tags?.filter((tag) => tag.id !== selectedTagId) ?? [];

      const todoList = this.kanban[kanbanId].list ?? [];
      todoList[todoIndex].tags = newTags;

      this.render();
    }
  }

  // ----------------------- TodoItem을 삭제하는 함수
  removeTodo(selectedId: Todo["id"], category: Todo["category"]) {
    const kanbanId = this.kanban.findIndex((kanban) => kanban.title === category);
    const targetKanban = this.kanban.find((kanban) => kanban.title === category);

    if (targetKanban) {
      const newTodo = targetKanban.list?.filter((todo) => todo.id !== selectedId);
      this.kanban[kanbanId].list = newTodo;

      this.render();
    }
  }

  // ----------------------- TodoItem을 추가하는 함수
  addTodo(category: Todo["category"]) {
    const $list = document.createElement("section");
    $list.classList.add("todo");
    $list.setAttribute("id", "add-item");

    $list.innerHTML = addTodoTemplate();

    $list.querySelector(".cancel")?.addEventListener("click", () => this.render());

    $list.querySelector(".add")?.addEventListener("click", ({ currentTarget }) => {
      const listId = this.kanban.findIndex(({ title }) => title === category);

      if (currentTarget && isButtonElement(currentTarget)) {
        const $todo = currentTarget.closest(".todo-item");
        const title = $todo?.querySelector(".add-title")?.textContent;
        const body = $todo?.querySelector(".add-content")?.textContent;

        const todoList = this.kanban[listId].list ?? [];
        const newTodoId = todoList.length > 0 ? uuidv4() : "0";

        const newTodo: inProgressTodo = {
          id: newTodoId,
          content: {
            title: title ?? "",
            body: body ?? "",
          },
          isDone: false,
          category: category,
          tags: [],
        };

        const todos = [...todoList, newTodo];
        this.kanban[listId].list = todos;

        this.render();
      }
    });
    return $list;
  }

  // ----------------------- Kanban을 삭제하는 함수
  removeKanban(selectedId: TodoList["id"]) {
    this.kanban = this.kanban.filter((kanban) => kanban.id !== selectedId);
    this.render();
  }

  // ----------------------- Kanban을 추가하는 함수
  generateKanban({ id, title, list }: TodoList) {
    const $list = document.createElement("section");
    $list.classList.add("board");

    // todo를 추가할 버튼
    const $addBtn = addListButtonTemplate(title);

    const $listHTML = list
      ?.map(({ id: todoId, content, tags }) => {
        return todoListTemplate({ todoId, title, content, tags });
      })
      .join("");

    const $item = `
    ${listHeaderTemplate({ id, list, title })}

    <div class="wrapper">
      ${$addBtn}
      ${list?.length ? $listHTML : ""}
    </div>
    `;

    $list.innerHTML = $item;
    return $list;
  }
}
const storageData = window.localStorage.getItem(KANBAN_LIST);
const loadKanban = storageData ? JSON.parse(storageData) : defaultKanban;
new KanbanApp(loadKanban);
