document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const todoInput = document.getElementById('todoInput');
    const addTodoButton = document.getElementById('addTodoButton');
    const todoList = document.getElementById('todoList');

    /**
     * Adds a new todo item to the list.
     * Performs validation to ensure the input is not empty.
     */
    const addTodoItem = () => {
        const todoText = todoInput.value.trim(); // Get value and remove leading/trailing whitespace

        // --- Validation ---
        if (!todoText) {
            // Optionally, provide visual feedback to the user (e.g., flash the input border red)
            console.warn("Todo input cannot be empty.");
            todoInput.focus(); // Keep focus on the input for easy retry
            return; // Exit if input is empty
        }

        // Create new list item element
        const listItem = document.createElement('li');
        listItem.setAttribute('aria-label', `Todo item: ${todoText}`);

        // Create a span to hold the todo text
        const todoTextSpan = document.createElement('span');
        todoTextSpan.classList.add('todo-text');
        todoTextSpan.textContent = todoText;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete todo item: ${todoText}`);

        // Append text and delete button to the list item
        listItem.appendChild(todoTextSpan);
        listItem.appendChild(deleteButton);

        // Append the new list item to the unordered list
        todoList.appendChild(listItem);

        // Clear the input field and refocus for the next entry
        todoInput.value = '';
        todoInput.focus();
    };

    /**
     * Handles the deletion of a todo item.
     * Uses event delegation on the parent list to handle clicks on dynamically created buttons.
     * @param {Event} event - The click event object.
     */
    const handleDeleteItem = (event) => {
        // Check if the clicked element is a delete button
        if (event.target.classList.contains('delete-button')) {
            const listItem = event.target.closest('li'); // Get the parent <li> element
            if (listItem) {
                todoList.removeChild(listItem); // Remove the list item from the DOM
                console.log(`Deleted todo item: ${listItem.querySelector('.todo-text').textContent}`);
            }
        }
    };

    // --- Event Listeners ---

    // Add todo item on button click
    addTodoButton.addEventListener('click', addTodoItem);

    // Add todo item on 'Enter' key press in the input field
    todoInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if input was part of a form
            addTodoItem();
        }
    });

    // Use event delegation for deleting items
    todoList.addEventListener('click', handleDeleteItem);

    // Initial focus on the input field when the page loads
    todoInput.focus();
});
