import { Router } from "express";
import Product from "../models/Product";
import Restaurant from "../models/Restaurant";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.post("/registro", async (req, res) => {
  const user = User(req.body);
  await user.save();
  res.redirect("/");
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

router.post("/Restaurant/register/:id", async (req, res) => {
  try {
    const restaurant = Restaurant(req.body);
    restaurant.popularidad = Math.floor(Math.random() * 10);
    restaurant.propietario = req.params.id;
    const user = await User.findById(req.params.id).lean();
    await restaurant.save();
    console.log(restaurant);
    res.redirect("/Restaurant/" + restaurant._id + "/" + user._id);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/Restaurant/pedido/:id/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid).lean();
    const restaurant = await Restaurant.findById(req.params.id).lean();
    const products = await Product.find({
      restaurante: restaurant._id,
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
    console.log(restaurant.propietario);
    const user = await User.findById(restaurant.propietario).lean();
    console.log(user);
    res.render("editRestaurant", { user, restaurant });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/editRestaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body
    ).lean();
    const user = await User.findById(restaurant.propietario).lean();
    res.redirect("/Restaurant/" + restaurant._id + "/" + user._id);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/deleteRestaurant/:id/:idU", async (req, res) => {
  try {
    const sortDesc = (number1, number2) =>
      number2.popularidad - number1.popularidad;
    const user = await User.findById(req.params.idU).lean();
    await Restaurant.findByIdAndDelete(req.params.id);
    const restaurants = await Restaurant.find().lean();
    restaurants.sort(sortDesc);
    const Admin_restaurants = restaurants.filter(
      (restaurant) => restaurant.propietario == user._id
    );
    if (Admin_restaurants.length > 0) {
      res.render("Restaurants", { user, restaurants: Admin_restaurants });
    } else {
      res.render("Reg_restaurant", { user });
    }
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

router.get("/deleteProduct/:idU/:idR/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/Restaurant/" + req.params.idR + "/" + req.params.idU);
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
    console.log(req.body);
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/inicio/" + req.params.id);
  } catch (error) {
    res.status(400).json(error.message);
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

router.get("/deleteUser/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/crearOrden/:idU/:idR/:id", async (req, res) => {
  try {
    const orden = Ordernes({});

  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
