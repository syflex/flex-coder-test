/**
 * script.js
 *
 * This script handles the functionality for a simple Todo list application.
 * It allows users to add new todo items, remove existing ones, and
 * persists the todo list to the browser's local storage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const todoInput = document.getElementById('new-todo-input');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoListContainer = document.getElementById('todo-list');

    // --- Constants ---
    const LOCAL_STORAGE_KEY = 'flexCoderTodos'; // Key for storing todos in local storage

    // --- Helper Functions ---

    /**
     * Generates a unique ID for a new todo item.
     * Uses a combination of timestamp and random string to minimize collision risk.
     * @returns {string} A unique ID string.
     */
    function generateUniqueId() {
        return 'todo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Loads todo items from local storage.
     * Handles potential parsing errors and returns an empty array if no data
     * or corrupted data is found.
     * @returns {Array<Object>} An array of todo objects (e.g., [{ id: '...', text: '...' }]).
     */
    function loadTodos() {
        const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
        try {
            return storedTodos ? JSON.parse(storedTodos) : [];
        } catch (e) {
            console.error('Error parsing todos from local storage:', e);
            // Return empty array to prevent app crash if data is corrupted
            return [];
        }
    }

    /**
     * Saves the current array of todo items to local storage.
     * @param {Array<Object>} todos - The array of todo objects to save.
     */
    function saveTodos(todos) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        } catch (e) {
            console.error('Error saving todos to local storage:', e);
            // Optionally, inform the user if local storage is full or unavailable
            alert('Could not save todos. Local storage might be full or unavailable.');
        }
    }

    /**
     * Creates a new DOM `<li>` element for a given todo object.
     * Attaches a delete button with an event listener.
     * @param {Object} todo - The todo object containing `id` and `text`.
     * @returns {HTMLLIElement} The created `<li>` element.
     */
    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.dataset.id = todo.id; // Store the todo ID as a data attribute

        const span = document.createElement('span');
        span.textContent = todo.text;
        li.appendChild(span);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.classList.add('remove-todo-button');
        deleteButton.addEventListener('click', () => {
            removeTodo(todo.id); // Call removeTodo when button is clicked
        });
        li.appendChild(deleteButton);

        return li;
    }

    // --- Core Functionality ---

    /**
     * Adds a new todo item to the list.
     * Performs validation, updates the DOM, and saves the list to local storage.
     * @param {string} text - The text content of the new todo item.
     */
    function addTodo(text) {
        const trimmedText = text.trim();

        // Validation: Prevent adding empty todo items
        if (!trimmedText) {
            alert('Todo item cannot be empty!');
            todoInput.focus(); // Keep focus on input for re-entry
            return;
        }

        const newTodo = {
            id: generateUniqueId(),
            text: trimmedText
        };

        // 1. Add to DOM: Create the element and append it to the list
        const todoElement = createTodoElement(newTodo);
        todoListContainer.appendChild(todoElement);

        // 2. Update Local Storage: Load existing, add new, then save
        const currentTodos = loadTodos();
        currentTodos.push(newTodo);
        saveTodos(currentTodos);

        // Clear input and maintain focus for quick successive additions
        todoInput.value = '';
        todoInput.focus();
    }

    /**
     * Removes a todo item from the list.
     * Updates the DOM and saves the modified list to local storage.
     * @param {string} id - The unique ID of the todo item to remove.
     */
    function removeTodo(id) {
        // 1. Remove from DOM: Find the element by its data-id and remove it
        const todoToRemove = document.querySelector(`.todo-item[data-id="${id}"]`);
        if (todoToRemove) {
            todoListContainer.removeChild(todoToRemove);
        } else {
            console.warn(`Attempted to remove todo with ID "${id}" but no matching DOM element was found.`);
        }

        // 2. Update Local Storage: Filter out the removed todo and save
        let currentTodos = loadTodos();
        currentTodos = currentTodos.filter(todo => todo.id !== id);
        saveTodos(currentTodos);
    }

    // --- Event Listeners ---

    // Event listener for the "Add Todo" button click
    addTodoButton.addEventListener('click', () => {
        addTodo(todoInput.value);
    });

    // Event listener for "Enter" key press on the input field
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo(todoInput.value);
        }
    });

    // --- Initialization ---

    /**
     * Renders all existing todo items from local storage onto the page
     * when the DOM is fully loaded.
     */
    function initializeTodos() {
        const initialTodos = loadTodos();
        initialTodos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoListContainer.appendChild(todoElement);
        });
    }

    // Call the initialization function
    initializeTodos();
});
