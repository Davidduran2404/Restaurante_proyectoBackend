import { Router } from "express";
import Task from "../models/Task";
import Product from "../models/Product";
import Restaurant from "../models/Restaurant";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  const tasks = await Task.find().lean();

  res.render("index", { tasks: tasks });
});

router.get("/2", async (req, res) => {
  // const tasks = await Task.find().lean();

  res.render("index2");
});

router.post("/registro", async (req, res) => {
  const user = User(req.body);
  await user.save();
  res.redirect("/2");
});

router.post("/Restaurant/register", async (req, res) => {
  const restaurant = Restaurant(req.body);
  await restaurant.save();
  res.render("Admin_restaurant");
});

router.post("/producto/add", async (req, res) => {
  const product = Product(req.body);
  await product.save();
  res.render("Admin_restaurant");
});

router.get("/inicio", async (req, res) => {
  const user = await User.find({ correo: req.query.correo });
  if (user[0].tipoCuenta == "Administrador de Restaurante") {
    res.render("Reg_restaurant", {user: user});
  } else if (user[0].tipoCuenta == "Domiciliario") {
    res.render("Domiciliario");
  } else {
    const restaurants = await Restaurant.find().lean();
    res.render("Client", { restaurants: restaurants });
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/edit/:id", async (req, res) => {
  const task = await Task.findById(req.params.id).lean();
  res.render("edit", { task });
});

router.post("/tasks/add", async (req, res) => {
  const task = Task(req.body);
  await task.save();
  res.redirect("/");
});

router.post("/edit/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

export default router;
