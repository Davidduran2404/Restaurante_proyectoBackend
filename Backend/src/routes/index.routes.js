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

router.post("/Restaurant/register/:nombre", async (req, res) => {
  console.log(req.body);
  const restaurant = Restaurant(req.body);
  restaurant.popularidad = Math.floor(Math.random() * 10);
  restaurant.propietario = req.params.nombre;
  console.log(restaurant);
  await restaurant.save();
  res.render("Admin_restaurant", { restaurant });
});

router.get("/Restaurant/pedido/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).lean();
  const products = await Product.find({ restaurante: restaurant.nombre }).lean();
  res.render("Orden", { restaurant, products: products });
});

router.get("/Restaurant/:id", async (req, res) => {
  console.log(req.params.id);
  const restaurant = await Restaurant.findById(req.params.id).lean();
  console.log(restaurant);
  res.render("Admin_restaurant", { restaurant });
});

router.post("/producto/add/:id", async (req, res) => {
  const product = Product(req.body);
  const restaurant = await Restaurant.findById(req.params.id).lean();
  product.restaurante = restaurant.nombre;
  await product.save();
  res.redirect("/Restaurant/" + restaurant._id);
});

router.get("/inicio", async (req, res) => {
  const user = await User.findOne({ correo: req.query.correo }).lean();
  const restaurants = await Restaurant.find().lean();
  if (user.tipoCuenta == "Administrador de Restaurante") {
    const Admin_restaurants = restaurants.filter(
      (restaurant) => restaurant.propietario == user.nombre
    );
    if (Admin_restaurants.length > 0) {
      res.render("Restaurants", { user, restaurants: Admin_restaurants });
    } else {
      res.render("Reg_restaurant", { user });
    }
  } else if (user.tipoCuenta == "Domiciliario") {
    res.render("Domiciliario", { user });
  } else {
    res.render("Client", { user, restaurants: restaurants });
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
