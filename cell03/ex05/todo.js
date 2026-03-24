const ftList = document.getElementById('ft_list');
const btnNew = document.getElementById('new_btn');

// --- Al cargar la página, leemos las cookies ---
window.onload = function() {
    const cookies = document.cookie.split('; ');
    const todoCookie = cookies.find(row => row.startsWith('todo_list='));

    if (todoCookie) {
        try {
            // Decodificamos y convertimos el string JSON de nuevo a Array
            const tasks = JSON.parse(decodeURIComponent(todoCookie.split('=')[1]));
            // Los añadimos a la lista (recorremos el array que guardamos)
            tasks.forEach(task => createTodoElement(task));
        } catch (e) {
            console.error("Error al cargar las cookies", e);
        }
    }
};

// --- Evento para el botón "New" ---
btnNew.onclick = function() {
    const taskText = prompt("¿Qué tienes que hacer?");
    
    // Verificamos que no sea nulo (cancelar) ni esté vacío
    if (taskText && taskText.trim() !== "") {
        createTodoElement(taskText);
        saveToCookies();
    }
};

// --- Función para crear el elemento en el DOM ---
function createTodoElement(text) {
    const div = document.createElement('div');
    div.className = 'todo-item';
    div.textContent = text;

    // Al hacer clic, preguntamos si eliminar
    div.onclick = function() {
        const confirmDelete = confirm("¿Deseas eliminar este TO DO?");
        if (confirmDelete) {
            this.remove();
            saveToCookies();
        }
    };

    // REGLA: Debe aparecer el primero (arriba)
    ftList.insertBefore(div, ftList.firstChild);
}

// --- Función para guardar el estado actual en Cookies ---
function saveToCookies() {
    const allTodos = [];
    const elements = ftList.querySelectorAll('.todo-item');
    
    // Recorremos los elementos del DOM y guardamos su texto
    // Guardamos en orden inverso para que al recargar se mantenga la jerarquía
    elements.forEach(el => allTodos.unshift(el.textContent));

    const jsonData = JSON.stringify(allTodos);
    
    // Guardamos la cookie con una duración de 7 días
    document.cookie = "todo_list=" + encodeURIComponent(jsonData) + "; path=/; max-age=" + (60*60*24*7);
}
