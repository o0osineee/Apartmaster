const TaskService = require('../services/taskService');

const TaskController = {
  createTask: async (req, res, next) => {
    try {
      const task = await TaskService.createTask(req.body);
      // Fetch the full task details to include department and employee info in response
      const newTaskDetails = await TaskService.getTaskById(task.id);
      res.status(201).json({ success: true, data: newTaskDetails, message: 'Task created successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await TaskService.getAllTasks();
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  },

  getTaskById: async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        const err = new Error('Task ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const task = await TaskService.getTaskById(taskId);
      if (!task) {
        const err = new Error('Task not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        const err = new Error('Task ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const updatedTask = await TaskService.updateTask(taskId, req.body);
      if (!updatedTask) {
        const err = new Error('Task not found or no changes made.');
        err.statusCode = 404; 
        return next(err);
      }
      const taskWithDetails = await TaskService.getTaskById(taskId); // Fetch full details
      res.status(200).json({ success: true, data: taskWithDetails, message: 'Task updated successfully.' });
    } catch (error) {
      next(error);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        const err = new Error('Task ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const success = await TaskService.deleteTask(taskId);
      if (!success) {
        const err = new Error('Task not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getTasksByDepartment: async (req, res, next) => {
    try {
      const departmentId = parseInt(req.params.departmentId);
      if (isNaN(departmentId)) {
        const err = new Error('Department ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const tasks = await TaskService.getTasksByDepartment(departmentId);
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  },

  getTasksByEmployee: async (req, res, next) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      if (isNaN(employeeId)) {
        const err = new Error('Employee ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const tasks = await TaskService.getTasksByEmployee(employeeId);
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = TaskController; 