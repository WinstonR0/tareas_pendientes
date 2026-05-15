// URL base de la api
//const API_URL = "https://tareas-pendientes-tn02.onrender.com/api/tareas";
const API_URL = "http://localhost:3000/api/tareas";

// Estado para editar tarea. Si es null, significa que esta en creando, si tiene algun valor significa que estamos editando.
let editando = null;

// variable global donde guardaremos las tareas que vamos a exportar
let tareasExportar = [];

// espacio por defecto
let espacio = "trabajo";

// 1. cargar las taeas al iniciar 
document.addEventListener("DOMContentLoaded", obtenerTareas);

// GET 
async function obtenerTareas() {

    try {
        
    const res = await fetch(`${API_URL}?espacio=${espacio}`);
    const tareas = await res.json();
    
    console.log(espacio);
    
    tareasExportar = tareas;

    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Esto lo que hace es limpiar la lista 

    tareas.forEach(tarea => {

        // Fecha con formato legible 
        const fechaFormateada = new Date(tarea.fecha).toLocaleString("es-CO", {
            dateStyle: "medium",
            timeStyle: "short"
        });

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

                <!-- Espacio -->
                <p class="font-medium">
                    ${espacio}
                </p>

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
                    class="border px-2 rounded hover:bg-red-300"
                    onclick="eliminarTarea('${tarea._id}')"
                >
                    Eliminar
                </button>

                <button 
                    class="border px-2 rounded hover:bg-green-300"
                    onclick="cambiarEstado('${tarea._id}', '${tarea.estado}')"
                >
                    Completar
                </button>

                <button
                    class="border px-2 rounded hover:bg-yellow-300"
                    onclick="editarTarea('${tarea._id}', '${tarea.titulo}')"
                >
                    Editar
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

    console.log(titulo);

    if (editando) {
        await fetch(`${API_URL}/${editando}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ titulo, espacio })
        })
        editando = null;

        document.getElementById("btnGuardar").textContent = "+";

    }else{

        await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, espacio })
    });
    }

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

function editarTarea(id, titulo){

    // debemos obtener el dato que nos va a mandar el usuario
    const input = document.getElementById("titulo");

    // camabir el texto por el input del usuario
    input.value = titulo;

    // guardar el id que se esta editando
    editando = id;

    // cambiar el texto del boton para que en luagr de que diga completar diga editando
    document.getElementById("btnGuardar").textContent = "Actualizar tarea";
}

// Funcion para exportar las tareas
async function exportarTareas() {
    let csv = "titulo, estado\n"

    tareasExportar.forEach((tarea) => {

        // Fecha con formato legible 
        const fechaFormateada = new Date(tarea.fecha).toLocaleString("es-CO", {
            dateStyle: "medium",
            timeStyle: "short"
        });

        csv += `${tarea.titulo},${tarea.estado},${fechaFormateada}\n`
    })

    // para convertir el texto en csv
    const blob = new Blob([csv]);

    // URL temporal para la descarga del archivo
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    // indicamos desde donde se descargara el archivo con href
    a.href = url;

    // ponemos un nobre al archivo con download
    a.download = "tareas.csv"

    a.click();

    URL.revokeObjectURL(url);
}

// funcion para cambiar de estado
function cambiarEspacio(nuevoEspacio) {
    
    // dejamos la variale de espacio en nuevoEspacio
    espacio = nuevoEspacio;
    obtenerTareas();
}


