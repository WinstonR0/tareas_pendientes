// insetar base de datos mongoose
const { type } = require("express/lib/response");
const mongoose = require("mongoose");

// creamos la estructura el schema
const TareaSchema = new mongoose.Schema({

    //Tutulo de la tarea
    titulo: {
        type: String, //cadena de texto
        required: true // obligatorio
    },

    // estado de la tarea
    estado:{
        type: String,
        enum: ["pendiente", "gestionando", "completado"], // valores permitidos
        default: "pendiente" // valor por defecto 
    },

    // fecha de creacion de la tarea
    fecha: {
        type: Date,
        default: Date.now // se pone automaticamente
    },

    // espacio, para permitir que otro usuario pueda mantener sus tareas en la misma base de datos
    espacio: {
        type:String,
        enum: [
            "winston", "trabajo", "julieth"
        ],
        default: "trabajo"
    }
    
});

// se crea el modelo
module.exports = mongoose.model("Tarea", TareaSchema);