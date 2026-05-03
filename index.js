// importar modelo de tareas
const Tarea = require("./models/Tarea")

const PORT = process.env.PORT || 3000;

// Cargas variables de entorno desde el archio .env
// esto permite usar process.env.MONGO_URI
require("dotenv").config(); //dotenv carga cofig secret

//Importar las librerias
const express = require("express"); //Framework para crear servidor
const mongoose=require("mongoose"); //para conectar con MOngoBD
const cors = require("cors"); // frontend


// Crear la app de Express
const app = express();

app.use(cors({
    origin: "https://hilarious-gnome-e49409.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// Iniciar el servidor
app.use(express.json());

//conexion con mongoDB Atlas ya que es en la nube
//se usa la URL que tenemos en el env
mongoose.connect(process.env.MONGO_URI)

// si conectar bien
.then(() => console.log("Mongoose conectado"))

//si falla 
.catch(err => console.log(err));

//una ruta de prueba
//cuando se entre a localhost:3000
app.get("/", (req,res) => {

    // req = request (Lo que envia el cliente)
    // res = response (LO que responde el servidor)

    res.send("API funcionando");
});

// levantar el servidor
// Hacer que la app escuche puerto 3000
app.listen(PORT, () => {
    console.log("Servidor corriendo", PORT);
});


// Metodo POST
app.post("/api/tareas", async (req, res) => {
    try {
        
        //otener datos del body o se lo que envia el usuario
        const { titulo } = req.body;

        // Crear una nueva tarea
        const nueva = new Tarea({
            titulo
        });

        //GUardar tarea e mongo
        await nueva.save();

        // Respuesta
        res.status(201).json(nueva);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

app.get("/api/tareas", async (req, res) => {
    try {
        
        // busca todas las tareas
        const tareas = await Tarea.find();

        //Muestra respuesta de todas las tareas en JSON
        res.json(tareas);

    } catch (error) {
        console.log("Error:", error);

        // si falla enviamos respuesta de error
        res.status(500).json({
            error: "Error al obtener tareas"
        });

    }
});

//Metodo PUT para actualizar una tarea por id 
app.put("/api/tareas/:id", async (req, res) => {
    try {
        
        // 1. Obtener el ID desde la URL
        const { id } = req.params;

        // 2. Obtener datos enviados desde el solicitante
        const { titulo, estado } = req.body;

        // 3. Crear un objeto SOLO con los campos que se quieren actualizar 
        //(Es una buena paractica, primordial usarlo)
        const datosActualizados = {
            titulo,
            estado
        }

        // 4. Buscar la tarea y actualizarla
        const tareaActualizada = await Tarea.findByIdAndUpdate(
            id,
            datosActualizados,
            {
                returnDocument: "after",        // devuelve la tarea ya actalizada
                runValidators: true  // Valida el enum del estado 
            }
        );

        // 5. Si no esxiste la tarea
        if (!tareaActualizada){
            return res.status(404).json({
                mensaje: "Tarea no encontrada"
            });
        }

        // 6. Respesta existosa
        res.json(tareaActualizada)

    } catch (error) {
        
        // 7. Manejo de errores
        res.status(500).json({
            mensaje: "Error al actualizar tarea",
            error: error.message
        });
    }
});


// metodo DELETE para eliminar tareas por id
app.delete("/api/tareas/:id", async (req, res) => {

    try {
        
        // 1. Obtener el id desde la URL
        const { id } = req.params;

        // 2. Buscar l atarea y eliminarla 
        const tareaEliminada = await Tarea.findByIdAndDelete(id);

        // 3. Validar si la tarea existe 
        if(!tareaEliminada){
            return res.status(400).json({
                mensaje: "La tarea no existe"
            });
        }

        // 4. Respuesta de exito
        res.json({
            mensaje: "Tarea eliminada",
            tarea: tareaEliminada
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error, no se pudo eliminar la tarea",
            error: error.message
        });
    }

});