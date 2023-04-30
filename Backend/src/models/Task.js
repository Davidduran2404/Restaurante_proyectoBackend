//schema son como los campos del modelo y el modelo es como una table
import { Schema, model, version } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        done: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,//para remplazar las propiuedades created y updated
        versionKey: false
    }
);

export default model('Task', taskSchema);