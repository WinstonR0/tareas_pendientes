// URL base de la api
const API_URL = "https://tareas-pendientes-tn02.onrender.com/api/tareas";

// 1. cargar las taeas al iniciar 
document.addEventListener("DOMContentLoaded", obtenerTareas);

// Fecha con formato legible 
const fechaFormateada = new Date (tareas.fecha).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
});

// GET 
async function obtenerTareas() {

    try {
        
    const res = await fetch(API_URL);
    const tareas = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Esto lo que hace es limpiar la lista 

    tareas.forEach(tarea => {

        let colorEstado;

        if(tarea.estado === "completado") {
            colorEstado = "text-green-500"
        }

        // crea los espacios para las tareas
        const li = document.createElement("li");

        li.className = "bg-gray-200 p-3 rounded-lg flex items-center justify-between hover:bg-gray-300"

        // Mostrar la info de las tareas
        li.innerHTML = `
            <div>

                <!-- Fecha -->
                <p class="font-medium">
                    ${fechaFormateada}
                </p>

                <!-- titulo -->
                <p class="font-medium ${tarea.estado === "completado" ? "line-through text-gray-400" : ""}">
                    ${tarea.titulo}
                </p>

                <!-- estado con color -->
                <span class="text-sm ${colorEstado}">
                    ${tarea.estado}
                </span>
            </div>

            <div class="ml-4 flex gap-2">
                <button 
                    class="border px-2 rounded hover:bg-red-200"
                    onclick="eliminarTarea('${tarea._id}')"
                >
                    Eliminar
                </button>

                <button 
                    class="border px-2 rounded hover:bg-green-200"
                    onclick="cambiarEstado('${tarea._id}', '${tarea.estado}')"
                >
                    Completar
                </button>
            </div>
        `;

        lista.appendChild(li);
    });

    } catch (error) {
        console.error("Error al obtener tareas:", error);
    }
    
}

// POST
async function crearTarea(){

    const input = document.getElementById("titulo");
    const titulo = input.value;

    if(!titulo) return alert("Escribe una tarea ???");

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo })
    });

    input.value = ""; // Para que este en blanco:
    obtenerTareas(); // Recargar la lista, esto para cada que vez que se agregue una tarea
}


// DELETE
async function eliminarTarea(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    obtenerTareas();
}

// Completar tarea
async function cambiarEstado(id, estadoActual) {

    let nuevoEstado;

    // logica de cambio de estado
    if(estadoActual === "pendiente") {
        nuevoEstado = "completado";
    }

    // peticion a la API
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })

    });

    // recargar tareas}
    obtenerTareas();

}



