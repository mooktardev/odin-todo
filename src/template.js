import { intlFormat } from "date-fns";
import { createDOMElement } from "./utils";
import {
  openEditProjectModal,
  fetchProjectTasks,
  projectListDiv,
  taskListDiv,
  openEditTaskModal,
  handleToggleTaskChecked,
  handleDeleteTask,
} from "./view";

// Create Project Item
const createProjectItem = ({ id, title }) => {
  const item = createDOMElement("div", "sidebar-project-item", { "data-project": id });
  const itemInfo = createDOMElement("span", "project-item-info", {});
  const itemIconFolder = createDOMElement("img", "icon", { src: "./images/folder-open.svg", "data-project": id, });
  const itemTitle = createDOMElement("span", "truncate");
  const itemIconEdit = createDOMElement("img", "edit-project-btn", { src: "./images/edit.svg", alt: "Edit project", "data-project": id, });

  itemTitle.innerHTML = title;
  itemIconFolder.onclick = fetchProjectTasks;
  itemIconEdit.onclick = openEditProjectModal;

  itemInfo.append(itemIconFolder, itemTitle);
  item.append(itemInfo, itemIconEdit);
  projectListDiv.append(item);

  return item;
};

// Create Task Item
const createTaskItem = (task) => {
    const { id, title, duedate, priority, notes, checked, project } = task
    const item = createDOMElement("div", ["task-item", priority,], {"data-task": id, "data-project": project});
    const itemInput = createDOMElement("div", "task-item-input");
    const itemCheckbox = createDOMElement("input", "task-item-checkbox", { type: "checkbox", name: `task-${id}`, "data-task": id });
    const itemText = createDOMElement("div", "task-item-text");
    const itemTitle = createDOMElement("label", "input-label", { for: `task-${id}` });
    const itemNotes = createDOMElement("p", "task-item-notes");
    const itemAction = createDOMElement("div", "task-item-action");
    const itemDuedate = createDOMElement("span", "task-item-duedate");
    const itemPriorityBtn = createDOMElement("button", ["change-task-item-priority", priority],{ title: `${priority} priority`, "data-project": project });
    const itemPriorityIcon = createDOMElement("img", "icon", {src: "./images/flag.svg", alt: "Change"});
    const itemEditBtn = createDOMElement("button", "edit-task-item", { title: "Edit task", "data-task": id, });
    const itemEditIcon = createDOMElement("img", "icon", { src: "./images/edit.svg", alt: "Edit", "data-task": id, "data-project": project });
    const itemDeleteBtn = createDOMElement("button", "delete-task-item", { title: "Delete task", "data-task": id });
    const itemDeleteIcon = createDOMElement("img", "icon", { src: "./images/delete.svg", alt: "Delete", "data-task": id, "data-project": project });

    if (checked) {
        itemCheckbox.setAttribute("checked", "checked");
    } else {
        itemCheckbox.removeAttribute(checked);
    }
    
    itemTitle.innerHTML = title;
    itemNotes.innerHTML = notes;
    itemDuedate.innerHTML = intlFormat(duedate);

    itemCheckbox.onclick = handleToggleTaskChecked;
    itemEditBtn.onclick = openEditTaskModal;
    itemDeleteBtn.onclick = handleDeleteTask;
    
    itemPriorityBtn.append(itemPriorityIcon);
    itemEditBtn.append(itemEditIcon);
    itemDeleteBtn.append(itemDeleteIcon);
    itemText.append(itemTitle, itemNotes);
    itemInput.append(itemCheckbox, itemText);
    itemAction.append(itemDuedate, itemPriorityBtn, itemEditBtn, itemDeleteBtn);
    item.append(itemInput, itemAction);
    taskListDiv.append(item);

    return item;
};

// Exports
export { createProjectItem, createTaskItem };
