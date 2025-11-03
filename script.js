document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const newTodoInput = document.getElementById('newTodoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoListUl = document.getElementById('todoList');

    /**
     * Loads todo items from localStorage and displays them.
     */
    const loadTodos = () => {
        try {
            const todos = JSON.parse(localStorage.getItem('todos') || '[]');
            todos.forEach(todoText => {
                appendTodoToDOM(todoText);
            });
        } catch (error) {
            console.error('Error loading todos from localStorage:', error);
            // In a production app, you might show a user-friendly error message.
            alert('Could not load your todo list due to an internal error.');
        }
    };

    /**
     * Saves all current todo items in the DOM to localStorage.
     */
    const saveTodos = () => {
        const todos = [];
        todoListUl.querySelectorAll('li span.todo-text').forEach(span => {
            todos.push(span.textContent);
        });
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
            console.error('Error saving todos to localStorage:', error);
            alert('Could not save your todo list due to an internal error. Please check your browser settings.');
        }
    };

    /**
     * Creates an `<li>` element for a todo item and appends it to the list.
     * @param {string} todoText - The text content of the todo item.
     */
    const appendTodoToDOM = (todoText) => {
        const li = document.createElement('li');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todo-text');
        todoSpan.textContent = todoText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            li.remove(); // Remove the list item from the DOM
            saveTodos(); // Update localStorage after deletion
        });

        li.appendChild(todoSpan);
        li.appendChild(deleteButton);
        todoListUl.appendChild(li);
    };

    /**
     * Adds a new todo item based on the input field's value.
     */
    const addTodo = () => {
        const todoText = newTodoInput.value.trim();

        // Input Validation
        if (!todoText) {
            alert('Please enter a todo item before adding!');
            newTodoInput.focus(); // Keep focus on the input
            return;
        }

        appendTodoToDOM(todoText);
        saveTodos(); // Save to localStorage
        newTodoInput.value = ''; // Clear the input field
        newTodoInput.focus(); // Keep focus on the input for quick adding
    };

    // Event Listeners
    addTodoBtn.addEventListener('click', addTodo);

    // Allow adding todo with Enter key
    newTodoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    // Initial load of todos when the page loads
    loadTodos();
});
