const addBtn = document.querySelector("#add-btn");
const addInp = document.querySelector("#new-element");
const newList = document.querySelector(".actions");
const itemVal = document.querySelector(".task-input");

addBtn.addEventListener("click", () => {
    if (addInp.value.trim() !== "") {
        let taskItem = document.createElement("div");
        taskItem.className = "task-item";

        let placeHolder = document.createElement("input");
        placeHolder.value = addInp.value;
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
        addInp.value = "";

        delBtn.addEventListener("click", () => {
            taskItem.remove();
        });
        editBtn.addEventListener("click", () => {
            placeHolder.readOnly = false
            placeHolder.addEventListener("mouseleave", () => {
                placeHolder.readOnly = true
            })
        })
    }
});


