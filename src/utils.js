// Generate IDs
const generateID = () => {
    return Math.random().toString(36).substring(2, 9)
}

// Selector
const selectEl = (el) => document.querySelector(el);
const selectEls = (el) => document.querySelectorAll(el);

// Create DOM element
const createDOMElement = (el, className, attrs) => {
    const domEl = document.createElement(el)
    for (let key in attrs) {
        domEl.setAttribute(key, attrs[key])
    }
    if (Array.isArray(className)) {
        className.forEach(item => domEl.classList.add(item))
    } else {
        domEl.classList.add(className)
    }
    return domEl
}

// ClassList
const containClassList = (el, classList) => el.classList.contains(classList)
const addClassList = (el, classList) => el.classList.add(classList)
const removeClassList = (el, classList) => el.classList.remove(classList)

// Locale Storage
const getStore = (el) => {
    return JSON.parse(localStorage.getItem(el))
}
const setStore = (el, value) => localStorage.setItem(el, JSON.stringify(value))
const removeStore = (el) => localStorage.removeItem(el)
const clearStore = () => localStorage.clear()

// Exports
export { 
    generateID, 
    selectEl, 
    selectEls,
    containClassList,
    addClassList,
    removeClassList,
    createDOMElement,
    getStore,
    setStore,
    removeStore,
    clearStore
}