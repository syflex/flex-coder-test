document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const todoInput = document.getElementById('todo-input');
    const todoCategory = document.getElementById('todo-category');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    // --- Global State ---
    let todos = []; // Array to hold todo objects { id, text, category, completed }

    // --- Functions ---

    /**
     * Loads todo items from localStorage.
     * Handles parsing errors and ensures the data structure is an array.
     */
    function loadTodos() {
        try {
            const storedTodos = localStorage.getItem('todos');
            if (storedTodos) {
                const parsedTodos = JSON.parse(storedTodos);
                // Basic validation: ensure parsed data is an array
                if (Array.isArray(parsedTodos)) {
                    todos = parsedTodos;
                } else {
                    console.warn("Data loaded from localStorage was not an array. Initializing with empty list.");
                    todos = [];
                }
            }
        } catch (error) {
            console.error("Error parsing todos from localStorage:", error);
            // If parsing fails, reset todos to an empty array to prevent further issues
            todos = [];
        }
        renderTodos(); // Always render after loading to display current state
    }

    /**
     * Saves the current array of todo items to localStorage.
     * Converts the todos array to a JSON string.
     */
    function saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
            console.error("Error saving todos to localStorage:", error);
            // Optionally, provide user feedback if storage fails (e.g., storage full)
            alert('Could not save todo item. Storage might be full.');
        }
    }

    /**
     * Renders the current list of todo items to the DOM.
     * Clears the existing list and re-creates elements for each todo.
     */
    function renderTodos() {
        todoList.innerHTML = ''; // Clear existing list items

        if (todos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No todos yet! Add one above.';
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
            return;
        }

        todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            // Add a class based on category for specific styling
            listItem.classList.add(`todo-item--${todo.category.toLowerCase()}`);

            const todoTextSpan = document.createElement('span');
            todoTextSpan.classList.add('todo-text');
            todoTextSpan.textContent = todo.text;

            const todoCategorySpan = document.createElement('span');
            todoCategorySpan.classList.add('todo-category-display');
            todoCategorySpan.textContent = `[${todo.category}]`;

            listItem.appendChild(todoTextSpan);
            listItem.appendChild(todoCategorySpan);
            todoList.appendChild(listItem);
        });
    }

    /**
     * Handles the addition of a new todo item.
     * Validates input, creates a new todo object, adds it to the list,
     * saves to localStorage, and re-renders the list.
     */
    function addTodo() {
        const todoText = todoInput.value.trim();
        const todoCategory = todoCategory.value; // "Work" or "Food"

        // Input validation
        if (todoText === '') {
            alert('Todo item cannot be empty! Please enter some text.');
            todoInput.focus(); // Keep focus on the input for convenience
            return;
        }

        // Create a new todo object
        const newTodo = {
            id: Date.now(), // Simple unique ID using timestamp
            text: todoText,
            category: todoCategory,
            completed: false // Placeholder for future feature (e.g., marking as done)
        };

        todos.push(newTodo); // Add the new todo to the array
        saveTodos();         // Persist the updated list to localStorage
        renderTodos();       // Update the displayed list in the UI

        todoInput.value = ''; // Clear the input field
        todoInput.focus();    // Keep focus on the input for quick consecutive entries
    }

    // --- Event Listeners ---

    // Add todo when the button is clicked
    addTodoBtn.addEventListener('click', addTodo);

    // Add todo when Enter key is pressed in the input field
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent potential form submission if input was inside a form
            addTodo();
        }
    });

    // --- Initialization ---
    // Load todos from localStorage and render them when the page loads
    loadTodos();
});
