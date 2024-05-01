export type Content = {
  title: string;
  body: string;
};
export type Tag = {
  id: string;
  content: string;
};
export interface Todo {
  id: string;
  content: Content;
  isDone: boolean;
  category: string;
  tags?: Tag[];
}

export interface inProgressTodo extends Todo {
  isDone: false;
}

export interface DoneTodo extends Todo {
  isDone: true;
}

export interface TodoList {
  id: string;
  title: string;
  list?: Todo[];
}

// 타입가드로 활용할 수 있는 타입 함수
export function isButtonElement(targetElement: EventTarget | HTMLElement): targetElement is HTMLButtonElement {
  return targetElement instanceof HTMLButtonElement;
}
