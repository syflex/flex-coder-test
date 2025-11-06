document.addEventListener('DOMContentLoaded', () => {
    console.log('Flex Coder Todo App loaded and ready!');

    // --- DOM Element References ---
    const todoTextInput = document.getElementById('todo-text-input');
    const todoCategorySelect = document.getElementById('todo-category-select');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoList = document.getElementById('todo-list');

    // --- Utility Functions ---

    /**
     * Renders a new todo item to the DOM.
     * @param {string} text - The todo description.
     * @param {string} category - The todo category.
     */
    function renderTodoItem(text, category) {
        // Remove placeholder if it exists
        const placeholder = todoList.querySelector('.placeholder-item');
        if (placeholder) {
            placeholder.remove();
        }

        const listItem = document.createElement('li');
        listItem.setAttribute('data-category', category); // For potential filtering/styling
        
        // Structure for todo item: text, category, and future action buttons
        listItem.innerHTML = `
            <span class="todo-text">${text}</span>
            <span class="category">${category}</span>
            <!-- Future: Add buttons for delete/complete here -->
        `;
        todoList.appendChild(listItem);
    }

    // --- Event Handlers ---

    /**
     * Handles the click event for the 'Add Todo' button.
     */
    function handleAddTodo() {
        const todoText = todoTextInput.value.trim();
        const todoCategory = todoCategorySelect.value; // Gets the 'value' attribute of the selected option

        // --- Client-Side Validation ---
        if (!todoText) {
            // Provide user feedback without blocking further interaction
            alert('Error: Todo text cannot be empty. Please enter a description.');
            todoTextInput.focus(); // Return focus to the input field
            return; // Stop function execution
        }

        if (todoText.length > 255) {
            alert('Error: Todo text is too long. Maximum 255 characters.');
            todoTextInput.focus();
            return;
        }

        if (!todoCategory) {
            alert('Error: Please select a category for the todo item.');
            todoCategorySelect.focus(); // Return focus to the category selector
            return; // Stop function execution
        }
        // --- End Client-Side Validation ---

        console.log(`Attempting to add todo: "${todoText}" (Category: ${todoCategory})`);

        // Simulate adding to a data store (for a real app, this would involve API calls or local storage)
        // For now, directly render to the DOM to show functionality
        renderTodoItem(todoText, todoCategory);

        // Clear input fields after successful addition
        todoTextInput.value = '';
        todoCategorySelect.value = ''; // Resets dropdown to "Select Category" (because its value is "")
        todoTextInput.focus(); // Keep focus on the text input for rapid entry
    }

    // --- Event Listeners ---
    addTodoButton.addEventListener('click', handleAddTodo);

    // Allow adding todo by pressing Enter key in the text input
    todoTextInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if input were inside a <form>
            addTodoButton.click(); // Programmatically click the add button
        }
    });

    // Optionally, if the placeholder item should be removed immediately
    // when a user starts typing, or if there were pre-existing todos from storage.
    // For now, it's removed only when the first todo is actually added.
});
