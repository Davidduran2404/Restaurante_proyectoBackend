//schema son como los campos del modelo y el modelo es como una table
import { Schema, model, version } from "mongoose";

const userSchema = new Schema(
    {
        correo: {
            type: String,
            required: true, //Si no me pasas el dato te tiro error porque es requerido
            unique: true,
            trim: true
        },
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true 
        },
        contrasena: {
            type: String,
            required: true
        },
        numCelular: {
            type: String,
            required: true,
            trim: true
        },
        direccion: {
            type: String,
            required: true,
            trim: true
        },
        tipoCuenta: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,//para remplazar las propiuedades created y updated
        versionKey: false
    }
);

export default model('User', userSchema);