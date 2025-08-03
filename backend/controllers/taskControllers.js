const Task = require('../models/taskModel');

exports.getalltasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch all tasks' });
  }
};

exports.createatask = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (!title || !description || !category || status === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newTask = new Task({
      title,
      description,
      category,
      status,
    });
    const savedTask = await newTask.save();
    res.status(201).json({message:'Success',savedTask});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error in creating a new task' });
  }
};

