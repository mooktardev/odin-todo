import { Project, Task, getAllProjects, getOneTask, getProjectTasks, getTasksByFilter, myProjects } from './model'
import { createProjectItem, createTaskItem } from './template'
import { selectEl, selectEls, addClassList, removeClassList, createDOMElement, setStore, getStore } from './utils';
import { openModal, resetModalForm } from '.';


// Local variables
let currentProjectTasks = []
setStore('currentProjectTasks', [])
setStore('activeProjectId', '')
setStore('editProjectId', '')
setStore('activeTaskIs', '')


// Get DOM elements
const sidebarMenuItems = selectEls('.sidebar-menu-item')
const projectListDiv = selectEl('#sidebar-project-list')
const projectModal = selectEl("#project-modal");
const projectForm = selectEl("#project-form");
const taskListTitle = selectEl('#task-list-title')
const taskListDiv = selectEl('#task-list')
const taskModal = selectEl("#task-modal");
const taskForm = selectEl("#task-form");
const completedTaskBtn = selectEl('#completed-task-btn')

// Set active class sidebar menu
const setSidebarItemActive = (el) => {
    let menuItems = []
    const sidebarProjectItems = selectEls('.sidebar-project-item')
    sidebarMenuItems.forEach(m => menuItems.push(m))
    !sidebarProjectItems.forEach(p => menuItems.push(p))
    menuItems.forEach(i => removeClassList(i, 'active'))
    addClassList(el, 'active')
}


/* 
    PROJECT ===============================================================
*/

// Clear Project List
const clearProjectListContainer = () => projectListDiv.innerHTML = ''

// Update Project List
const updateProjectListContainer = () => {
    setStore('currentProjects', myProjects.projects)
    clearProjectListContainer()
    const projects = getStore('currentProjects')
    for (let project of projects) {
        createProjectItem(project)
    }
}

// update project select dropdown
const updateProjectSelect = () => {
    const select = selectEl('#form-task-project')
    select.innerHTML = ''
    getAllProjects().map(project => {
        select.append(projectSelectOption(project))
    })
}
const projectSelectOption = ({ id, title }) => {
    const option = createDOMElement('option', 'text-grapy-400', { value: id })
    option.innerHTML = title
    return option
}

// Handle add project from form
const handleAddProjectForm = (e) => {
    const title = selectEl('#form-project-title').value
    const project = new Project({title: title})
    const errorEl = selectEl(".form-project-title-error")
    if (!myProjects.isInProject(project.title)) {
        myProjects.addProject(project)
        createProjectItem(project)
        addClassList(errorEl, 'hidden')
        resetModalForm(projectForm, projectModal)
        activeProjectId = project.getId()
        setStore('activeProjectId', project.getId)
        fetchProjectTasks()
        updateProjectSelect()
    } else {
        removeClassList('hidden')
    }
}

// Open and set modal fields
const openEditProjectModal = (e) => {
    openModal(projectModal, "Edit Project", "Update", "edit")
    const projectId = e.target.dataset.project
    const project = myProjects.getProject(projectId)
    const title = selectEl('#form-project-title')
    title.value = project.title
    setStore('editProjectId', projectId)
}

// Handle edit project from form
const handleEditProjectForm = () => {
    const project = myProjects.getProject(getStore('editProjectId'))
    const title = selectEl('#form-project-title')
    myProjects.updateProjectTitle(project.id, title.value)
    updateProjectListContainer()
    resetModalForm(projectForm, projectModal)
}

// handle submit form
projectForm.onsubmit = (e) => {
    e.preventDefault()
    const formType = projectForm.dataset.formType
    if (formType === 'add') {
        handleAddProjectForm()
    } else if (formType === 'edit') {
        handleEditProjectForm()
    }
}



/* 
    TASKS ===============================================================
*/
// Clear task List
const clearTaskListContainer = () => taskListDiv.innerHTML = ''

// Update task List
const updateTaskListContainer = () => {
    clearTaskListContainer()
    for (let task of getStore('currentProjectTasks')) {
        if (task !== undefined) createTaskItem(task)
    }
}

// Fetch tasks from a project
const fetchProjectTasks = (e) => {
    let activeProjectId = getStore('activeProjectId') || getAllProjects()[0].id
    const projectId = e ? e.target.dataset.project : activeProjectId
    const project = myProjects.getProject(projectId)
    const tasks = getProjectTasks(projectId)
    const sideProjectItemEl = selectEl(`.sidebar-project-item[data-project='${projectId}']`)
    setStore('currentProjectTasks', tasks)
    setStore('activeProjectId', activeProjectId)
    taskListTitle.innerHTML = project.getTitle()
    setSidebarItemActive(sideProjectItemEl)
    updateTaskListContainer()
}

// Add task from form
const handleAddTaskForm = () => {
    const title = selectEl("#form-task-title").value
    const notes = selectEl("#form-task-notes").value
    const duedate = selectEl("#form-task-duedate").value
    const priority = selectEl("#form-task-priority").value
    const projectId = selectEl("#form-task-project").value
    const project = myProjects.getProject(projectId)
    const errorEl = selectEl(".form-task-title-error")

    const task = new Task({title: title, duedate: duedate, priority: priority, notes:notes, project: projectId })

    if (!project.isInTask(task.title)) {
        project.addTask(task)
        createTaskItem(task)
        addClassList(errorEl, 'hidden')
        resetModalForm(taskForm, taskModal)
        updateTaskListContainer()
    } else {
        removeClassList(errorEl, 'hidden')
    }
}

// Open and populate task data
const openEditTaskModal = (e) => {
    openModal(taskModal, "Edit Task", "Update", "edit")
    const taskId = e.target.dataset.task
    const projectId = e.target.dataset.project
    const task = getOneTask(taskId)[0]
    const formatedDueDate = new Date(task.duedate).toISOString().split('T')[0]
    setStore('activeTaskId' , taskId)
    selectEl('#form-task-title').value = task.title
    selectEl('#form-task-notes').value = task.notes
    selectEl('#form-task-duedate').value = formatedDueDate
    selectEl('#form-task-priority').value = task.priority
    selectEl('#form-task-project').value = task.project
    priorityOptionSelected(projectId)
}

// Set selected the option with value as same as project id
const priorityOptionSelected = (projectId) => {
    const options = selectEls('#form-task-project option')
    options.forEach(option => {
        option.removeAttribute('selected')
        if (option.value === projectId) {
            option.setAttribute('selected', 'selected')
        }
    })
}

// Edit task from form
const handleEditTaskForm = () => {
    const title = selectEl("#form-task-title").value
    const notes = selectEl("#form-task-notes").value
    const duedate = selectEl("#form-task-duedate").value
    const priority = selectEl("#form-task-priority").value
    const projectId = selectEl("#form-task-project").value
    const newTask = {title: title, notes: notes, duedate: duedate, priority: priority, project: projectId}
    const project = myProjects.getProject(projectId)
    project.updateTask(getStore('activeTaskId'), newTask)
    updateTaskListContainer()
    resetModalForm(taskForm, taskModal)
}

// handle submit form
taskForm.onsubmit = (e) => {
    e.preventDefault()
    const formType = taskForm.dataset.formType
    if (formType === 'add') {
        handleAddTaskForm()
    } else if (formType === 'edit') {
        handleEditTaskForm()
    }
}

// Toggle task completed
const handleToggleTaskChecked = (e) => {
    const taskId = e.target.dataset.task
    const projectId = e.target.dataset.projectId
    const project = myProjects.getProject(projectId)
    project.toggleCompleted(taskId)
    updateTaskListContainer()
}

// Delete button
const handleDeleteTask = (e) => {
    const taskId = e.target.dataset.task
    const projectId = e.target.dataset.projectId
    const project = myProjects.getProject(projectId)
    if (confirm("Do you want to delete this task?")) {
        project.removeTask(taskId)
        currentProjectTasks = project.tasks
        setStore('currentProjectTasks', project.task)
        updateTaskListContainer()
    }
}

// Fetch filtered's tasks
sidebarMenuItems.forEach(btn => {
    btn.onclick = (e) => {
        setSidebarItemActive(btn)
        currentProjectTasks = getTasksByFilter(btn.id)
        setStore('currentProjectTasks', getTasksByFilter(btn.id))
        taskListTitle.innerHTML = btn.innerText
        updateTaskListContainer()
    }
})
completedTaskBtn.addEventListener('click', () => {
    currentProjectTasks = currentProjectTasks.filter(task => task.checked)
    const tasks = getStore('currentProjectTasks')
    const filteredTasks = tasks.filter(task => task.checked)
    setStore('currentProjectTasks', filteredTasks)
    taskListTitle.innerHTML = 'Completed'
    updateTaskListContainer()
})


// WINDOW EVENT
window.addEventListener('DOMContentLoaded', () => {
    updateProjectListContainer()
    fetchProjectTasks()
    updateProjectSelect()
})


/* 
    EXPORTS ===============================================================
*/
export { 
    openEditProjectModal, 
    projectListDiv, 
    taskListDiv, 
    fetchProjectTasks, 
    openEditTaskModal,
    handleToggleTaskChecked,
    handleDeleteTask
}