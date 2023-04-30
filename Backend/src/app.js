import express from "express";
import { create } from "express-handlebars";
import indexRoutes from "./routes/index.routes";
import path from "path";
import morgan from "morgan";

const app = express();

app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  create({
    partialsDir: path.join(app.get("views"), "partials"),
    layoutsDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "main",
    extname: ".hbs",
  }).engine
);
app.set("view engine", ".hbs");

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

//Routes
app.use(indexRoutes);

export default app;
