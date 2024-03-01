let markerBtn = "mark";
document.getElementById("menu-btn").addEventListener("click", () => {
  const menuSection = document.getElementById("menu-section");
  const mainSection = document.getElementById("main");

  if (menuSection.classList.contains("menu--active")) {
    menuSection.classList.remove("menu--active");
    mainSection.classList.remove("main--active-2");
  } else {
    menuSection.classList.add("menu--active");
    mainSection.classList.add("main--active-2");
  }
});

// adding deleteAndMarkHandler() to the action button (Delete)
document.getElementById("deleteAll").addEventListener("click", () => {
  deleteAndMarkHandler("delete");
});
// adding deleteAndMarkHandler() to the action button (Mark As Done)
document.getElementById("markDone").addEventListener("click", () => {
  deleteAndMarkHandler("mark");
});
// adding searchHandler() to the search bar
document.getElementById("search").addEventListener("input", () => {
  searchHandler();
});

// this function will call deleteTask() or markDone() based on the condition
function deleteAndMarkHandler(condition) {
  const selectedTasks = JSON.parse(localStorage.getItem("selected"));
  const selectedTasksCounter = document.getElementById("selected");
  const actionButtonsContainer = document.getElementById("actions");

  if (condition === "delete") {
    deleteTask(selectedTasks[0], selectedTasks[1]);
  } else if (condition === "mark") {
    markDone(selectedTasks[0], selectedTasks[1]);
  }

  selectedTasksCounter.innerText = `[0]`;
  actionButtonsContainer.classList.remove("actions-active");
}

// this function will handel and render the search result
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
        const spanDate = document.createElement("span");
        const taskDate = new Date(task.taskDate);
        const todaysDate = new Date();

        // apply color based on the date
        if (task.taskIsDone) {
          spanDate.classList.add("color--gray");
        } else if (
          taskDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)
        ) {
          spanDate.classList.add("color--yellow");
        } else if (
          taskDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)
        ) {
          spanDate.classList.add("color--red");
        } else {
          spanDate.classList.add("color--green");
        }

        spanDate.innerText = task.taskDate;
        result.innerHTML = task.taskName;

        result.addEventListener("click", () => {
          resultContainer.innerHTML = "";
          editSection("edit", task);
        });

        result.appendChild(spanDate);
        resultContainer.appendChild(result);
      }
    });
  }
}

// this section will handel the selection of sections
// then it will call updateTasks() to display the tasks of the section.
function selectSection(selectedSection) {
  const title = document.getElementById("title-tag");
  const parent = document.getElementById("timeline");
  const children = parent.children;

  // remove the selected effect from all the sections
  for (let i = 0; i < children.length; i++) {
    children[i].classList.remove("timeline__div--selected");
    children[i].children[1].classList.remove("timeline__span--selected");
  }

  // apply the selected effect to the selected sections
  children[selectedSection].classList.add("timeline__div--selected");
  children[selectedSection].children[1].classList.add(
    "timeline__span--selected"
  );

  // display the title based on the selection

  switch (selectedSection) {
    case 0:
      title.innerText = "Upcoming";
      break;
    case 1:
      title.innerText = "Today";
      break;
    case 2:
      title.innerText = "Done";
      break;
    case 3:
      title.innerText = "Overdue";
      break;
    case 4:
      title.innerText = "Overdue";
      break;
    default:
      title.innerText = "Upcoming";
      break;
  }

  if (selectedSection === 2) {
    markerBtn = "unmark";
  } else {
    markerBtn = "mark";
  }

  updateTasks(selectedSection);
}

// this will open the edit section to edit tasks or to add new tasks
function editSection(condition, task, selectedSection) {
  if (screen.width <= 600) {
    const menuSection = document.getElementById("menu-section");
    // const mainSection = document.getElementById("main");

    menuSection.classList.add("menu--active");
    // mainSection.classList.remove("main--active-2");
  }

  const main = document.getElementById("main");
  const titleOfEdit = document.getElementById("edit-title");
  const buttonsContainer = document.getElementById("edit-controls");
  const nameInput = document.getElementById("task-name");
  const descriptionInput = document.getElementById("task-description");
  const dateInput = document.getElementById("task-date");
  const menuSection = document.getElementById("menu-section");

  if (menuSection.classList.contains("menu--active")) {
    main.classList.add("main--active-3");
  } else {
    main.classList.add("main--active");
  }
  nameInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  buttonsContainer.innerHTML = "";

  // priming localStorage for tasks
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
  }
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  // this will open the edit section based on the condition (add new task) or (edit task)
  if (condition === "new") {
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");

    titleOfEdit.innerText = "New Task";
    btn1.innerText = "Cancel";
    btn2.innerText = "Add New Task";

    btn1.addEventListener("click", () => {
      closeEditSection();
    });

    btn2.addEventListener("click", () => {
      if (
        inputValidation(
          nameInput.value,
          descriptionInput.value,
          dateInput.value
        )
      ) {
        tasks.push({
          taskName: nameInput.value,
          taskDescription: descriptionInput.value,
          taskDate: dateInput.value,
          taskIsDone: false,
          taskOverdue: false,
          taskId: Date.now(),
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        closeEditSection();

        const taskDate = new Date(dateInput.value);
        const todaysDate = new Date();
        if (taskDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
          selectSection(1);
        } else {
          selectSection(0);
        }

        updateTasks();
      }
    });
    buttonsContainer.append(btn2, btn1);

    ////////////////////////////
  } else if (condition === "edit") {
    nameInput.value = task.taskName;
    descriptionInput.value = task.taskDescription;
    dateInput.value = task.taskDate;

    titleOfEdit.innerText = "Edit Task";
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    const btn3 = document.createElement("button");

    btn1.innerText = "Delete";
    btn1.addEventListener("click", () => {
      deleteTask([task], selectedSection);
    });
    if (selectedSection === 2) {
      btn2.innerText = "Unmark Done";
      btn2.addEventListener("click", () => {
        unMarkDone([task], selectedSection);
      });
    } else {
      btn2.innerText = "Mark As Done";
      btn2.addEventListener("click", () => {
        markDone([task], selectedSection);
      });
    }
    btn3.innerText = "Save Changes";
    btn3.addEventListener("click", () => {
      if (
        inputValidation(
          nameInput.value,
          descriptionInput.value,
          dateInput.value
        )
      ) {
        saveChanges(task.taskId, {
          taskName: nameInput.value,
          taskDescription: descriptionInput.value,
          taskDate: dateInput.value,
        });
      }
    });
    buttonsContainer.append(btn3, btn1, btn2);
  }
}

function closeEditSection() {
  const main = document.getElementById("main");
  const menuSection = document.getElementById("menu-section");
  if (screen.width <= 600) {
    main.classList.add("main--active-2");
  }

  if (menuSection.classList.contains("menu--active")) {
    main.classList.remove("main--active-3");
  } else {
    main.classList.remove("main--active");
  }
}

function deleteTask(tasksToDelete, selectedSection) {
  let allTasks = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < allTasks.length; i++) {
    for (let x = 0; x < tasksToDelete.length; x++) {
      if (allTasks[i].taskId === tasksToDelete[x].taskId) {
        allTasks.splice(i, 1);
      }
    }
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  closeEditSection();
  updateTasks(selectedSection);
}

function markDone(tasksToMark, selectedSection) {
  if (markerBtn == "mark") {
    let allTasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < allTasks.length; i++) {
      for (let x = 0; x < tasksToMark.length; x++) {
        if (allTasks[i].taskId === tasksToMark[x].taskId) {
          allTasks[i].taskIsDone = true;
        }
      }
    }
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    closeEditSection();
    selectSection(2);
    updateTasks();
  } else {
    unMarkDone(tasksToMark, selectedSection);
  }
}

function unMarkDone(tasksToUnmark, selectedSection) {
  let allTasks = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < allTasks.length; i++) {
    for (let x = 0; x < tasksToUnmark.length; x++) {
      if (allTasks[i].taskId === tasksToUnmark[x].taskId) {
        allTasks[i].taskIsDone = false;
      }
    }
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  closeEditSection();
  updateTasks(selectedSection);
}

function saveChanges(oldTaskId, newChanges, selectedSection) {
  let allTasks = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].taskId === oldTaskId) {
      allTasks[i].taskName = newChanges.taskName;
      allTasks[i].taskDescription = newChanges.taskDescription;
      allTasks[i].taskDate = newChanges.taskDate;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  closeEditSection();
  updateTasks(selectedSection);
}

// the function will update the DOM to display any new tasks
function updateTasks(selectedSection) {
  // this just to get the selected section
  const timeline = document.getElementById("timeline").children;
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].classList.contains("timeline__div--selected")) {
      selectedSection = i;
    }
  }
  const mainAllTasks = document.getElementById("main-allTasks");
  mainAllTasks.innerHTML = "";

  localStorage.removeItem("selected");
  document.getElementById("selected").innerText = `[0]`;
  document.getElementById("actions").classList.remove("actions-active");

  // priming localStorage
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
  }
  let allTasks = JSON.parse(localStorage.getItem("tasks"));

  // counting the dueToday tasks
  const dueToday = allTasks.filter((task) => {
    const taskDate = new Date(task.taskDate);
    const todaysDate = new Date();
    return (
      taskDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) &&
      task.taskIsDone === false
    );
  });

  // counting the upComing tasks
  const upComing = allTasks.filter((task) => {
    const taskDate = new Date(task.taskDate);
    const todaysDate = new Date();
    return (
      task.taskIsDone === false &&
      taskDate.setHours(0, 0, 0, 0) >= todaysDate.setHours(0, 0, 0, 0)
    );
  });

  // counting the doneTasks tasks
  const doneTasks = allTasks.filter((task) => {
    return task.taskIsDone === true;
  });

  // counting the overdueTasks tasks
  const overdueTasks = allTasks.filter((task) => {
    const taskDate = new Date(task.taskDate);
    const todaysDate = new Date();
    return (
      taskDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0) &&
      task.taskIsDone === false
    );
  });

  // priming localStorage for notes
  if (!localStorage.getItem("notes")) {
    localStorage.setItem("notes", JSON.stringify([]));
  }
  const allNotes = JSON.parse(localStorage.getItem("notes"));

  document.getElementById("upcoming-count").innerText = upComing.length;
  document.getElementById("today-count").innerText = dueToday.length;
  document.getElementById("done-count").innerText = doneTasks.length;
  document.getElementById("overdue-count").innerText = overdueTasks.length;
  document.getElementById("notes-count").innerText = allNotes.length;

  // 4 = sticky Notes Section - rendering sticky notes from localStorage
  if (selectedSection === 4) {
    const stickyNotesWrap = document.createElement("div");
    const addStickyNote = document.createElement("div");
    const addStickyNoteImg = document.createElement("img");
    const noteBase = document.getElementById("stickyNotes--base");
    const closeNote = document.getElementById("close-note");
    const deleteNote = document.getElementById("delete-note");
    const textArea = noteBase.children[1];

    stickyNotesWrap.classList.add("stickyNotes");
    addStickyNote.classList.add("stickyNotes--addNew");
    addStickyNoteImg.src = "./src/assets/imgs/icons/plus.png";

    closeNote.addEventListener("click", () => {
      noteBase.classList.remove("stickyNotes--active");
      setTimeout(() => {
        textArea.value = "";
        noteBase.style.display = "none";
      }, 100);
      updateTasks();
    });

    //handling the creation of sticky notes and pushing a unique ID to them
    addStickyNote.addEventListener("click", () => {
      allNotes.push(["", Date.now()]);
      localStorage.setItem("notes", JSON.stringify(allNotes));
      updateTasks();
    });

    // rendering sticky notes from localStorage
    for (let i = 0; i < allNotes.length; i++) {
      const noteDiv = document.createElement("div");
      noteDiv.innerText = allNotes[i][0];

      // opening sticky Note handler
      noteDiv.addEventListener("click", () => {
        if (screen.width <= 600) {
          const menuSection = document.getElementById("menu-section");
          const mainSection = document.getElementById("main");

          mainSection.classList.add("main--active-2");
          menuSection.classList.add("menu--active");
          // mainSection.classList.remove("main--active-2");
        }
        // display sticky note
        noteBase.style.display = "block";
        textArea.value = allNotes[i][0];
        setTimeout(() => {
          noteBase.classList.add("stickyNotes--active");
        }, 100);

        // Handling input inside the sticky note and saving to localStorage
        textArea.addEventListener("input", () => {
          allNotes[i][0] = textArea.value;
          localStorage.setItem("notes", JSON.stringify(allNotes));
        });

        // deleting sticky notes
        deleteNote.addEventListener("click", () => {
          allNotes.splice(i, 1);
          localStorage.setItem("notes", JSON.stringify(allNotes));
          noteBase.classList.remove("stickyNotes--active");
          setTimeout(() => {
            textArea.value = "";
            noteBase.style.display = "none";
          }, 100);
          updateTasks();
        });
      });
      stickyNotesWrap.appendChild(noteDiv);
    }
    addStickyNote.appendChild(addStickyNoteImg);
    stickyNotesWrap.appendChild(addStickyNote);
    mainAllTasks.appendChild(stickyNotesWrap);

    ///////////////////////
  } else {
    // rendering tasks from localStorage
    allTasks.forEach((task) => {
      const taskDate = new Date(task.taskDate);
      const todaysDate = new Date();

      // rendering the tasks based on the conditions
      // example: if the selected section is (Today) only today's tasks will render etc...
      if (
        (task.taskIsDone === false &&
          taskDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) &&
          selectedSection === 1) ||
        (task.taskIsDone === false &&
          taskDate.setHours(0, 0, 0, 0) >= todaysDate.setHours(0, 0, 0, 0) &&
          selectedSection === 0) ||
        (task.taskIsDone === true && selectedSection === 2) ||
        (task.taskIsDone === false &&
          taskDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0) &&
          selectedSection === 3)
      ) {
        const taskWrap = document.createElement("div");
        const contentWrap = document.createElement("div");
        const checkbox = document.createElement("input");
        const spanName = document.createElement("span");
        const spanDate = document.createElement("span");
        const editButton = document.createElement("button");
        const editWrap = document.createElement("div");

        taskWrap.classList.add("main__task");
        editButton.innerText = "Edit";
        checkbox.type = "checkbox";

        // when checked the action buttons will appear (Delete) & (Mark As Done)
        // and it will save the selected tasks to localStorage
        checkbox.addEventListener("change", (e) => {
          ////////////////////////////

          const actionButtonsContainer = document.getElementById("actions");
          const selectedCounter = document.getElementById("selected");
          const markAsDoneBtn = document.getElementById("marker");

          // if selectedSection == 2 == (Done Section) display Unmark
          if (selectedSection === 2) {
            markAsDoneBtn.innerHTML = "Unmark Done";
          } else {
            markAsDoneBtn.innerHTML = "Mark As Done";
          }

          // priming localStorage for selected tasks
          if (!localStorage.getItem("selected")) {
            localStorage.setItem("selected", JSON.stringify([[]]));
          }
          let selectedTasks = JSON.parse(localStorage.getItem("selected"));

          // if checkbox is checked push selected task to selectedTasks
          // if unchecked remove it from selectedTasks
          if (e.currentTarget.checked) {
            selectedTasks[0].push(task);
          } else {
            selectedTasks[0] = selectedTasks[0].filter((name) => {
              return name.taskId !== task.taskId;
            });
          }

          //update selected tasks counter
          selectedCounter.innerText = `[${selectedTasks[0].length}]`;

          if (!selectedTasks[0].length) {
            actionButtonsContainer.classList.remove("actions-active");
          } else {
            actionButtonsContainer.classList.add("actions-active");
          }

          // save selectedTasks to localStorage
          localStorage.setItem(
            "selected",
            JSON.stringify([selectedTasks[0], selectedSection])
          );
        });

        editButton.addEventListener("click", () => {
          editSection("edit", task, selectedSection);
        });

        spanName.innerText = task.taskName; //display task name
        spanDate.innerText = `Due Date: ${task.taskDate}`; //display task date

        //display color based on the date
        if (task.taskIsDone) {
          spanDate.classList.add("color--gray");
        } else if (
          taskDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)
        ) {
          spanDate.classList.add("color--yellow");
        } else if (
          taskDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)
        ) {
          spanDate.classList.add("color--red");
        } else {
          spanDate.classList.add("color--green");
        }

        editWrap.append(spanDate, editButton);
        contentWrap.append(checkbox, spanName);
        taskWrap.append(contentWrap, editWrap);
        mainAllTasks.append(taskWrap);
      }
    });
  }
}

function inputValidation(name, description, date) {
  const err = document.getElementById("err");
  const inputDate = new Date(date);
  const todaysDate = new Date();

  if (!name || !date) {
    const message = `Please Fill All Input Fields\n${!name ? "(Name) " : ""}${
      !date ? "(Date) " : ""
    }`;

    err.innerText = message;
    err.classList.add("err-active");

    setTimeout(() => {
      err.classList.remove("err-active");
    }, 5000);

    return false;
  } else if (inputDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
    err.innerText = `The date must be in the future`;
    err.classList.add("err-active");

    setTimeout(() => {
      err.classList.remove("err-active");
    }, 5000);
    return false;
  } else {
    return true;
  }
}

// onload display (Upcoming) section
window.addEventListener("load", () => {
  selectSection(0);
  if (screen.width <= 600) {
    const menuSection = document.getElementById("menu-section");
    const mainSection = document.getElementById("main");
    menuSection.classList.add("notransition");
    mainSection.classList.add("notransition");
    menuSection.classList.add("menu--active");
    mainSection.classList.add("main--active-2");

    setTimeout(() => {
      menuSection.classList.remove("notransition");
      mainSection.classList.remove("notransition");
    }, 100);
  }
});
