export class Project {
  constructor(title, desc=null) {
    this.title = title;
    this.desc = desc;
    this.todoList = [];
  }

  pushTodoList(todoObj) { this.todoList.push(todoObj); }

  removeAtIndex(i) { this.todoList.splice(i, 1); }
}

export class Todo {
  constructor(title) {
    this.title = title
    this.checklist = [];
  }
  
  pushToChecklist(checklistItemObj) { this.checklist.push(checklistItemObj); }

  removeAtIndex(i) { this.checklist.splice(i, 1); }
}

export class ChecklistItem {
  constructor(text, dueDate=null, priority=null) {
    this.text = text;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isDone = false;
  }
}