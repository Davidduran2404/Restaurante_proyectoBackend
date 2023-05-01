import { Schema, model, version } from "mongoose";

const productSchema = new Schema(
    {
        restaurante: String,
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        categories: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 1000
        },
    },
    {
        timestamps: true,//para remplazar las propiuedades created y updated
        versionKey: false
    }
);

export default model('Product', productSchema);