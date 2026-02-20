const addBtn = document.querySelector("#add-btn");
const addInp = document.querySelector("#new-element");
const newList = document.querySelector(".actions");

const STORAGE_KEY = "todo-tasks";

const loadTasks = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const saveTasks = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

let tasks = loadTasks();

const findTaskIndex = (taskId) => {
    return tasks.findIndex((task) => task.id === taskId);
};

const renderTask = (task) => {
    let taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.dataset.taskId = task.id;

    let placeHolder = document.createElement("input");
    placeHolder.value = task.text;
    placeHolder.className = "task-input";
    placeHolder.type = "text";
    placeHolder.readOnly = true;

    let delBtn = document.createElement("button");
    delBtn.textContent = "DELETE";
    delBtn.className = "delete-btn";

    let editBtn = document.createElement("button");
    editBtn.textContent = "EDIT";
    editBtn.className = "edit-btn";

    taskItem.appendChild(placeHolder);
    taskItem.appendChild(delBtn);
    taskItem.appendChild(editBtn);

    newList.appendChild(taskItem);

    const finishEdit = (shouldSave) => {
        if (placeHolder.readOnly) {
            return;
        }

        placeHolder.readOnly = true;
        editBtn.textContent = "EDIT";

        if (!shouldSave) {
            if (placeHolder.dataset.originalValue !== undefined) {
                placeHolder.value = placeHolder.dataset.originalValue;
            }
            return;
        }

        const trimmedValue = placeHolder.value.trim();
        if (trimmedValue === "") {
            if (placeHolder.dataset.originalValue !== undefined) {
                placeHolder.value = placeHolder.dataset.originalValue;
            }
            return;
        }

        const index = findTaskIndex(task.id);
        if (index >= 0) {
            tasks[index].text = trimmedValue;
            saveTasks(tasks);
        }
    };

    let skipBlur = false;

    delBtn.addEventListener("click", () => {
        taskItem.remove();
        tasks = tasks.filter((item) => item.id !== task.id);
        saveTasks(tasks);
    });

    editBtn.addEventListener("mousedown", () => {
        if (!placeHolder.readOnly) {
            skipBlur = true;
        }
    });

    editBtn.addEventListener("touchstart", () => {
        if (!placeHolder.readOnly) {
            skipBlur = true;
        }
    });

    editBtn.addEventListener("click", () => {
        if (placeHolder.readOnly) {
            placeHolder.dataset.originalValue = placeHolder.value;
            placeHolder.readOnly = false;
            editBtn.textContent = "SAVE";
            placeHolder.focus();
            placeHolder.setSelectionRange(placeHolder.value.length, placeHolder.value.length);
            return;
        }

        finishEdit(true);
    });

    placeHolder.addEventListener("blur", () => {
        if (skipBlur) {
            skipBlur = false;
            return;
        }
        finishEdit(true);
    });

    placeHolder.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEdit(true);
            placeHolder.blur();
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            finishEdit(false);
            placeHolder.blur();
        }
    });
};

const addTask = () => {
    const trimmedValue = addInp.value.trim();
    if (trimmedValue === "") {
        return;
    }

    const newTask = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: trimmedValue,
    };

    tasks.push(newTask);
    saveTasks(tasks);
    renderTask(newTask);

    addInp.value = "";
};

addBtn.addEventListener("click", addTask);

addInp.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

tasks.forEach((task) => {
    renderTask(task);
});


