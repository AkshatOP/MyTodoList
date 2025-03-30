import Tododb from "../models/todo.js";


export const getTodo = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // ✅ Fetch only the todos that belong to the logged-in user
        const todos = await Tododb.find({ userId: req.user.id });

        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addTodo = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        const existingTodo = await Tododb.findOne({ title, userId: req.user.id });
        if (existingTodo) {
            return res.status(409).json({ error: "This task already exists!" });
        }
        const newTodo = new Tododb({ title , completed: false, userId: req.user.id });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const toggleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Tododb.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        todo.completed = !todo.completed;
        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchTodo = async (req, res) => {
    try {
        const { query } = req.query;
        const Todos = await Tododb.find({title : { $regex: query, $options: "i" }})
        res.status(200).json(Todos);
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
}



export const deleteTodo = async (req, res) => {
    try {

        const deletedTodo = await Tododb.findByIdAndDelete(req.params.id)
        if (!deletedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({ "message": "To-Do Deleted successfully" });



    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};