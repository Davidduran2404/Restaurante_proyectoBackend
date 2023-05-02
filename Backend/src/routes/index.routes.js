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

router.post("/Restaurant/register/:id", async (req, res) => {
  console.log(req.body);
  const restaurant = Restaurant(req.body);
  restaurant.popularidad = Math.floor(Math.random() * 10);
  restaurant.propietario = req.params.id;
  console.log(restaurant);
  await restaurant.save();
  res.render("Admin_restaurant", { restaurant });
});

router.get("/Restaurant/pedido/:id/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params["userid"]).lean();
    const restaurant = await Restaurant.findById(req.params["id"]).lean();
    const products = await Product.find({
      restaurante: restaurant.nombre,
    }).lean();
    res.render("menuComida", { user, restaurant, products: products });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/Restaurant/:id/:idU", async (req, res) => {
  try {
    const user = await User.findById(req.params.idU).lean();
    const restaurant = await Restaurant.findById(req.params.id).lean();
    const products = await Product.find({
      restaurante: restaurant._id,
    }).lean();
    res.render("Admin_restaurant", { user, restaurant, products: products });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/editRestaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    res.render("editRestaurant", { restaurant });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/editRestaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body).lean();
    const user = await User.findById(restaurant.propietario).lean();
    res.redirect("/Restaurant/" + restaurant._id + "/" + user._id);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/producto/add/:id/:idU", async (req, res) => {
  try {
    const product = Product(req.body);
    const user = await User.findById(req.params.idU).lean();
    const restaurant = await Restaurant.findById(req.params.id).lean();
    product.restaurante = restaurant._id;
    await product.save();
    res.redirect("/Restaurant/" + restaurant._id + "/" + user._id);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/editProduct/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  res.render("editProduct", { product });
});

router.post("/editProduct/:id", async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    ).lean();
    const restaurant = await Restaurant.findById(producto.restaurante).lean();
    res.redirect(
      "/Restaurant/" + producto.restaurante + "/" + restaurant.propietario
    );
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/inicio", async (req, res) => {
  const sortDesc = (number1, number2) =>
    number2.popularidad - number1.popularidad;
  const user = await User.findOne({ correo: req.query.correo }).lean();
  const restaurants = await Restaurant.find().lean();
  restaurants.sort(sortDesc);
  if (user.tipoCuenta == "Administrador de Restaurante") {
    const Admin_restaurants = restaurants.filter(
      (restaurant) => restaurant.propietario == user._id
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

router.get("/inicio/:id", async (req, res) => {
  try {
    const sortDesc = (number1, number2) =>
      number2.popularidad - number1.popularidad;
    const user = await User.findByIdAndUpdate(req.params.id, req.body).lean();
    const restaurants = await Restaurant.find().lean();
    restaurants.sort(sortDesc);
    res.render("Client", { user, restaurants: restaurants });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/about/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    res.render("about", { user });
  } catch (error) {
    res.status(400).json(error.message);
  }
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

router.get("/editUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    res.render("editUser", { user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/editUser/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/inicio/" + req.params.id);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
