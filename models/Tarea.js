// insetar base de datos mongoose
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
    }
    
});

// se crea el modelo
module.exports = mongoose.model("Tarea", TareaSchema);