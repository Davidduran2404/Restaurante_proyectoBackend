import { Schema, model, version } from "mongoose";

const restaurantSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        direccion: {
            type: String,
            required: true,
            trim: true
        },
        categoria: {
            type: String,
            required: true
        },
        propietario:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true,//para remplazar las propiuedades created y updated
        versionKey: false
    }
);

export default model('Restaurant', restaurantSchema);