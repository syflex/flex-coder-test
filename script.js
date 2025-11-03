/**
 * script.js
 *
 * This script provides the core functionality for a simple Todo List application.
 * It handles loading, saving, adding, toggling completion, and deleting todo items
 * using localStorage for persistence and DOM manipulation for rendering.
 */

// --- DOM Element References ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// --- Global State ---
// Array to store todo objects: [{ id: string, text: string, completed: boolean }]
let todos = [];

// localStorage key for storing todos
const STORAGE_KEY = 'flex-coder-todos';

// --- Helper Functions ---

/**
 * Generates a simple unique ID for a todo item.
 * Combines current timestamp with a random string for reasonable uniqueness.
 * @returns {string} A unique ID.
 */
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Loads todos from localStorage.
 * Handles potential errors during parsing and ensures data integrity.
 * If no todos are found or an error occurs, initializes an empty array.
 */
const loadTodos = () => {
    try {
        const storedTodos = localStorage.getItem(STORAGE_KEY);
        if (storedTodos) {
            const parsedTodos = JSON.parse(storedTodos);
            // Basic validation to ensure todos is an array and items have expected structure
            if (Array.isArray(parsedTodos)) {
                todos = parsedTodos.map(todo => ({
                    id: todo.id || generateId(), // Ensure ID exists, or generate one
                    text: typeof todo.text === 'string' ? todo.text : 'Untitled Todo',
                    completed: typeof todo.completed === 'boolean' ? todo.completed : false
                }));
            } else {
                console.warn('Stored data is not an array. Initializing empty todos.');
                todos = [];
            }
        } else {
            todos = [];
        }
    } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        // Fallback to empty array on any parsing or storage error
        todos = [];
    }
};

/**
 * Saves the current 'todos' array to localStorage.
 * Handles potential errors during stringification.
 */
const saveTodos = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('Error saving todos to localStorage:', error);
        alert('Failed to save todos. Your browser might be in private mode or storage is full.');
    }
};

/**
 * Renders all todo items to the DOM.
 * Clears the existing list and rebuilds it based on the 'todos' array.
 */
const renderTodos = () => {
    todoList.innerHTML = ''; // Clear existing list items

    if (todos.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No todos yet! Add one above.';
        todoList.appendChild(emptyMessage);
        return;
    }

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.className = 'todo-item';
        // Add 'completed' class if the todo is completed
        if (todo.completed) {
            listItem.classList.add('completed');
        }
        // Store the todo ID in a data attribute for event delegation
        listItem.dataset.id = todo.id;

        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'todo-actions';

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = todo.completed ? 'Uncomplete' : 'Complete';
        toggleButton.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete "${todo.text}"`);

        actionsContainer.appendChild(toggleButton);
        actionsContainer.appendChild(deleteButton);

        listItem.appendChild(todoText);
        listItem.appendChild(actionsContainer);
        todoList.appendChild(listItem);
    });
};

// --- Event Handlers ---

/**
 * Handles the submission of the todo form.
 * Adds a new todo item to the list.
 * @param {Event} event The submit event.
 */
const addTodo = (event) => {
    event.preventDefault(); // Prevent default form submission (page reload)

    const text = todoInput.value.trim();

    // Input validation
    if (text === '') {
        alert('Todo description cannot be empty!');
        todoInput.focus(); // Focus back to input for user convenience
        return;
    }

    const newTodo = {
        id: generateId(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();    // Save changes to localStorage
    renderTodos();  // Re-render the list to show the new todo
    todoInput.value = ''; // Clear the input field
};

/**
 * Handles clicks on the todo list using event delegation.
 * Determines if a toggle or delete button was clicked and performs the action.
 * @param {Event} event The click event.
 */
const handleTodoClick = (event) => {
    const target = event.target;
    // Find the closest parent 'li' element with the 'todo-item' class
    const listItem = target.closest('.todo-item');

    if (!listItem) {
        return; // Click was not on a todo item or its children
    }

    const todoId = listItem.dataset.id; // Get the ID from the data attribute

    if (target.classList.contains('toggle-button')) {
        // Toggle completion status
        todos = todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos(); // Re-render to update classes and button text
    } else if (target.classList.contains('delete-button')) {
        // Delete todo item
        if (confirm('Are you sure you want to delete this todo?')) {
            todos = todos.filter(todo => todo.id !== todoId);
            saveTodos();
            renderTodos();
        }
    }
};

// --- Initialization ---

/**
 * Initializes the application when the DOM is fully loaded.
 * Loads existing todos, renders them, and attaches event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();

    // Attach event listeners
    todoForm.addEventListener('submit', addTodo);
    // Use event delegation for clicks on the todo list
    todoList.addEventListener('click', handleTodoClick);
});
