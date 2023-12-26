import { addDays, addWeeks, endOfDay, format, isSameDay, isWithinInterval, nextFriday, nextMonday, nextTuesday, startOfDay, toDate } from "date-fns"
import { generateID, localeStore, setStore } from "./utils"


// TASk CONSTRUCTOR
class Task {
    constructor({title, duedate, priority, notes, checked, project}) {
        this.id = generateID(),
        this.title = title,
        this.duedate = duedate || new Date(),
        this.priority = priority,
        this.notes = notes,
        this.checked = checked || false,
        this.project = project
    }
    getId() {
        return this.id
    }
}


// PROJECT CONSTRUCTOR
class Project {
    constructor({id, title, completed, tasks}) {
        this.id = id || generateID(),
        this.title = title,
        this.completed = completed || false, // Default value is false if not provided
        this.tasks = tasks || []
    }
    getId() {
        return this.id
    }
    getTitle() {
        return this.title
    }
    getTasks() {
        return this.tasks
    }
    getTask(id) {
        return this.tasks.find(t => t.id === id)
    }
    isInTask(title) {
        return this.tasks.some(t => t.title === title)
    }
    addTask(task) {
        if (!this.isInTask(task)) {
            return this.tasks.push(task)
        }
    }
    updateTask(id, newTask) {
        const task = this.getTask(id)
        console.log(task)
        console.log(newTask.priority)
        if (task) {
            task.title = newTask.title,
            task.duedate = newTask.duedate,
            task.priority = newTask.priority,
            task.notes = newTask.notes,
            task.checked = newTask.checked,
            task.project = newTask.project
        }
        return task
    }
    toggleCompleted(id) {
        const task = this.getTask(id)
        task.checked = !task.checked
        return task
    }
    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id)
        return this.tasks
    }
}


// PROJECTS CONSTRUCTOR
class Projects {
    constructor() {
        this.projects = []
    }
    getProjects() {
        return this.projects
    }
    getProject(id) {
        return this.projects.find(p => p.id === id)
    }
    isInProject(title) {
        return this.projects.some(p => p.title === title)
    }
    addProject(project) {
        if (!this.isInProject(project.title)) {
            return this.projects.push(project)
        }
    }
    updateProjectTitle(id, title) {
        const project = this.getProject(id)
        if (project) project.title = title
    }
    removeProject(id) {
        this.projects = this.projects.filter(p => p.id !== id)
    }
}
// Init a project
const myProjects = new Projects()

// Demo data
const demo_project_1 = new Project({title: 'Demo project 1'})
myProjects.addProject(demo_project_1)
const demo_task_1 = {
    title: 'Demo task 1',
    priority: 'high',
    notes: 'Demo notes lorem',
    checked: false,
    project: demo_project_1.getId()
}
const demo_task1 = new Task(demo_task_1)
demo_project_1.addTask(demo_task1)

setStore('myProjects', myProjects.projects)


// Get all tasks in specific project
const getProjectTasks = (id) => {
    const project = myProjects.getProject(id)
    return project.getTasks()
}

// Get all projects
const getAllProjects = () => {
    return myProjects.getProjects()
}

// Get all tasks
const getAllTasks = () => {
    const projects = myProjects.getProjects()
    let tasks = []
    projects.map(project => {
        for (let task of project.tasks) tasks.push(task)
    })

    return tasks
}

// Get filtered tasks in all projects
const getTasksByFilter = (filterby) => {
    const projects = myProjects.getProjects()
    let tasks = []
    const today = new Date()
    const isInWeek = (duedate) => isWithinInterval(duedate, { start: today, end: addWeeks(today, 1)})

    projects.map(p => {
        // get all tasks by filter's type and push them in tasks list
        const projectTasks = getProjectTasks(p.id)
        if (filterby === 'today') {
            projectTasks.forEach(task => {
                if (isSameDay(toDate(task.duedate), toDate(today))) tasks.push(task)
            });
        } else if (filterby === 'nextweek') {
            projectTasks.forEach(task => {
                if (isInWeek(task.duedate)) tasks.push(task)
            })
        } else if (filterby === 'important') {
            projectTasks.forEach(task => {
                if (task.priority === 'high') tasks.push(task)
            })
        } else if (filterby === 'alltasks') {
            projectTasks.map(task => tasks.push(task))
        } else if (filterby === 'completed') {
            projectTasks.forEach(task => {
                if (task.completed) tasks.push(task)
            });
        }
        // tasks.push(p.id)
    })
    // console.log(tasks)
    return tasks
}

// Get specific task
const getOneTask = (taskId) => {
    const tasks = getAllTasks()
    return tasks.filter(task => task.id === taskId)
}


// Exports
export { 
    myProjects, 
    Project, 
    Task, 
    getProjectTasks, 
    getAllProjects,
    getOneTask,
    getTasksByFilter
}