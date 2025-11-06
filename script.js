/**
 * Ensures the DOM is fully loaded before executing JavaScript.
 * This prevents errors where scripts try to access elements that aren't yet available.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Get References to HTML Elements ---
    // These are the core elements we'll interact with for the todo feature.
    const todoInput = document.getElementById('todoInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');

    /**
     * Handles the logic for adding a new todo item to the list.
     * This function performs input validation, creates a new list item,
     * appends it to the DOM, and then clears the input field.
     */
    function addTodo() {
        // 1. Retrieve Input Value and Clean It:
        //    .value gets the current text from the input field.
        //    .trim() removes any leading or trailing whitespace (spaces, tabs, newlines)
        //    to ensure clean data and handle cases where users might just type spaces.
        const todoText = todoInput.value.trim();

        // --- Input Validation ---
        // 2. Check if the input is empty after trimming.
        //    An empty string implies the user didn't provide any meaningful input.
        if (todoText === '') {
            // Provide immediate feedback to the user.
            // A simple alert is used here for demonstration, in a more complex app
            // a temporary message on the UI or a visual cue on the input field would be better.
            alert('Todo item cannot be empty. Please enter a description!');
            todoInput.focus(); // Keep focus on the input field to allow quick re-entry.
            return; // Exit the function early as there's nothing valid to add.
        }

        // --- Create New List Item (li) ---
        // 3. Dynamically create a new <li> element.
        //    This element will represent a single todo item in our list.
        const listItem = document.createElement('li');

        // 4. Set the text content of the newly created <li>.
        //    The textContent property is safer than innerHTML when inserting user-provided text
        //    as it automatically escapes HTML, preventing potential XSS attacks.
        listItem.textContent = todoText;

        // --- Append to the Todo List (ul) ---
        // 5. Add the new <li> element as a child to the <ul> element.
        //    This visually adds the new todo item to the list on the webpage.
        todoList.appendChild(listItem);

        // --- Clear Input Field and Restore Focus ---
        // 6. Reset the input field to an empty string, preparing it for the next todo.
        todoInput.value = '';

        // 7. Return focus to the input field.
        //    This enhances user experience, allowing them to type the next todo without
        //    manually clicking on the input field again.
        todoInput.focus();
    }

    // --- Event Listeners ---

    // 1. Attach a 'click' event listener to the 'Add Todo' button.
    //    When the button is clicked, the `addTodo` function will be executed.
    addButton.addEventListener('click', addTodo);

    // 2. Attach a 'keypress' event listener to the todo input field.
    //    This allows users to press the 'Enter' key to add a todo,
    //    providing a more convenient and faster way to interact with the app.
    todoInput.addEventListener('keypress', (event) => {
        // Check if the pressed key is 'Enter'.
        if (event.key === 'Enter') {
            addTodo(); // Call the same function that the button click uses.
        }
    });

    console.log('Todo application script initialized successfully.'); // A simple log for debugging/confirmation
});
