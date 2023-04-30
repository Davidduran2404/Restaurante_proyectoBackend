import { Schema, model, version } from "mongoose";

const ordertSchema = new Schema(
  {
    id: Number,
    state: {
      type: String,
      required: true,
      enum: [
        "creado",
        "aceptado",
        "recibido",
        "En curso",
        "realizado",
      ],
    },
    date: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, //para remplazar las propiuedades created y updated
    versionKey: false,
  }
);

export default model("Product", ordertSchema);
