const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/focusflow")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const Task = require("./models/Task");

// GET all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// ADD task
app.post("/tasks", async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        completed: false
    });
    await newTask.save();
    res.json(newTask);
});

// TOGGLE task
app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));