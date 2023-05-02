import { Schema, model, version } from "mongoose";

const ordertSchema = new Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ["creado", "aceptado", "recibido", "En curso", "realizado"],
    },
    producto: String,
    restaurante: String,
    cliente: String,
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
