const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/focusflow")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const Task = require("./models/Task");
const User = require("./models/User");

const SECRET = "supersecretkey";




function authenticate(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
}




app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        res.status(400).json({ message: "Error creating user" });
    }
});




app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ id: user._id }, SECRET);

        res.json({ token });

    } catch (err) {
        res.status(400).json({ message: "Login failed" });
    }
});




app.get("/tasks", authenticate, async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

app.post("/tasks", authenticate, async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        completed: false,
        userId: req.user.id
    });

    await newTask.save();
    res.json(newTask);
});

app.put("/tasks/:id", authenticate, async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json(task);
});

app.delete("/tasks/:id", authenticate, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});