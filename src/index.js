import './view'
import { selectEl, selectEls } from './utils'

// Toggle show/hide sidebar on mobile menu
const sidebarBtn = selectEl('.sidebar-toggle')
const sidebar = selectEl('#sidebar')
sidebarBtn.addEventListener('click', () => {
  sidebarBtn.classList.toggle('active')
  sidebar.classList.toggle('show')
  sidebar.classList.toggle('hide')
})
         

// modal functions
const openModal = (modal, title = "New", button = "Create", formType = "add") => {
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
  }
  modal.querySelector('form').dataset.formType = formType
  modal.querySelector("h3").innerHTML = title;
  modal.querySelector("button[type='submit']").innerHTML = button
};
const closeModal = (modal) => {
  if (!modal.classList.contains("hidden")) modal.classList.add("hidden");
};
const resetModalForm = (form, modal) => {
  closeModal(modal);
  form.reset();
};

/* 
    TASK MODAL FORM
*/
const taskModal = selectEl("#task-modal");
const taskForm = selectEl("#task-form");
const addTaskBtns = selectEls(".add-task-btn");
const editTaskBtns = selectEls(".edit-task-item");
const closeTaskModalBtn = selectEl(".close-task-modal");
const resetTaskFormBtn = selectEl("#task-modal button[type='reset']");
// Modal events
addTaskBtns.forEach((btn) => {
  btn.onclick = () => openModal(taskModal, "New Task");
});
editTaskBtns.forEach((btn) => {
  btn.onclick = () => openModal(taskModal, "Edit Task");
});
closeTaskModalBtn.onclick = () => closeModal(taskModal);
resetTaskFormBtn.onclick = () => resetModalForm(taskForm, taskModal);
window.onkeydown = (e) => {
  if (e.key === "Escape") closeModal(taskModal);
};

/* 
    PROJECT MODAL FORM
*/
const projectModal = selectEl("#project-modal");
const projectForm = selectEl("#project-form");
const addProjectBtn = selectEl(".add-project-btn");
const closeProjectModalBtn = selectEl(".close-project-modal");
const resetProjectFormBtn = selectEl("#project-form button[type='reset']");
// // Modal events
addProjectBtn.onclick = () => openModal(projectModal, "New Project");
closeProjectModalBtn.onclick = () => closeModal(projectModal);
resetProjectFormBtn.onclick = () => resetModalForm(projectForm, projectModal);
window.onkeydown = (e) => {
  if (e.key === "Escape") closeModal(projectModal);
};

export { openModal, closeModal, resetModalForm }