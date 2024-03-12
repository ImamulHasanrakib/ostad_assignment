const TaskModel = require('../models/TaskModel');

const createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await TaskModel.create({
      title: title,
      description: description,
      owner: req.user._id,
    });
    res.status(201).json({
      message: 'Task created successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllTask = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ owner: req.user._id });
    res.status(200).json({
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'completed'];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  const taskDetails = req.body;

  if (!isValidUpdate) {
    return res.status(400).json({ error: 'Invalid update fields' });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: taskDetails,
      },
      {
        new: true,
      }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!task.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to modify this task' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndDelete({
      _id: req.params.id,
    });

    console.log(task);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!task.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this task' });
    }
    res.status(204).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
};
