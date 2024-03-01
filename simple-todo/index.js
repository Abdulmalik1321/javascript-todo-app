document.getElementById("form").addEventListener("submit", (e) => {
  const newTodo = document.getElementById("new-todo");
  if (!newTodo.value) {
    const err = document.getElementById("err");
    err.innerText = "Todo Must Have a Name";
    err.classList.add("err-active");
    setTimeout(() => {
      err.classList.remove("err-active");
    }, 2000);
  } else {
    const todaysDate = new Date();
    if (localStorage.getItem("tasks") === null) {
      localStorage.setItem("tasks", JSON.stringify([]));
    }
    let todos = JSON.parse(localStorage.getItem("tasks"));
    todos.push({
      taskName: newTodo.value,
      taskDescription: "",
      taskDate: `${todaysDate.getFullYear()}-0${
        todaysDate.getMonth() + 1
      }-${todaysDate.getDate()}`,
      taskIsDone: false,
      taskOverdue: false,
      taskId: Date.now(),
    });
    localStorage.setItem("tasks", JSON.stringify(todos));
    renderTodos();
  }
  e.preventDefault();
});

document.getElementById("search").addEventListener("input", () => {
  searchHandler();
});

function searchHandler() {
  const searchBar = document.getElementById("search");
  const resultContainer = document.getElementById("menu-result");
  let allTasks = JSON.parse(localStorage.getItem("tasks"));

  resultContainer.innerHTML = ""; //remove the previous result

  if (searchBar.value) {
    allTasks.forEach((task) => {
      // looping through all the tasks and checking if any includes the search word
      if (task.taskName.toLowerCase().includes(searchBar.value.toLowerCase())) {
        const result = document.createElement("p");

        result.innerHTML = task.taskName;

        resultContainer.appendChild(result);
      }
    });
  }
}

function renderTodos() {
  let todos = JSON.parse(localStorage.getItem("tasks"));

  const todosWrap = document.getElementById("todos");
  todosWrap.innerHTML = "";

  todos.forEach((todo) => {
    const wrapDiv = document.createElement("div");
    const innerDiv1 = document.createElement("div");
    const innerDiv2 = document.createElement("div");

    const checkbox = document.createElement("input");
    const span = document.createElement("span");

    const deleteBtn = document.createElement("button");
    const editBtn = document.createElement("button");

    checkbox.type = "checkbox";
    span.innerText = todo.taskName;
    deleteBtn.innerText = "Delete";
    editBtn.innerText = "Edit";

    checkbox.checked = todo.taskIsDone;

    checkbox.addEventListener("change", () => {
      let todosChecked = JSON.parse(localStorage.getItem("tasks"));
      if (todosChecked[todos.indexOf(todo)].taskIsDone) {
        todosChecked[todos.indexOf(todo)].taskIsDone = false;
      } else {
        todosChecked[todos.indexOf(todo)].taskIsDone = true;
      }
      localStorage.setItem("tasks", JSON.stringify(todosChecked));
    });

    deleteBtn.addEventListener("click", () => {
      let todosDelete = JSON.parse(localStorage.getItem("tasks"));
      todosDelete.splice(todos.indexOf(todo), 1);
      localStorage.setItem("tasks", JSON.stringify(todosDelete));
      renderTodos();
    });

    editBtn.addEventListener("click", () => {
      span.innerHTML = `<input type="text" class="edit-input" id="edit-${todo.taskName}" value="${todo.taskName}"><button id="save-${todo.taskName}">Save</button>`;

      document
        .getElementById(`save-${todo.taskName}`)
        .addEventListener("click", () => {
          const newInput = document.getElementById(
            `edit-${todo.taskName}`
          ).value;

          let todosEdit = JSON.parse(localStorage.getItem("tasks"));
          todosEdit[todos.indexOf(todo)].taskName = newInput;
          localStorage.setItem("tasks", JSON.stringify(todosEdit));
          renderTodos();
        });
    });

    innerDiv1.append(checkbox, span);
    innerDiv2.append(deleteBtn, editBtn);

    wrapDiv.append(innerDiv1, innerDiv2);
    todosWrap.append(wrapDiv);
  });
}

window.addEventListener("load", () => {
  renderTodos();
});
