import { Router } from "express";
import Task from "../models/Task";

const router = Router();

router.get("/", async (req, res) => {
  const tasks = await Task.find().lean();

  res.render("index", { tasks: tasks });
});

router.get("/2", async (req, res) => {
  // const tasks = await Task.find().lean();

  res.render("index2");
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
