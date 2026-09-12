const TaskModel = require('../models/taskModel');

const TaskService = {
  createTask: async (taskData) => {
    return TaskModel.createTask(taskData);
  },

  getAllTasks: async () => {
    return TaskModel.getAllTasks();
  },

  getTaskById: async (taskId) => {
    return TaskModel.getTaskById(taskId);
  },

  updateTask: async (taskId, taskData) => {
    // Ensure all fields are provided for update, even if null, to match model's expectation for defined fields.
    // Or, adjust model to handle partial updates more gracefully if that's desired.
    const existingTask = await TaskModel.getTaskById(taskId); // Fetch to get current values
    if (!existingTask) return null; // Task not found

    const dataToUpdate = {
        title: taskData.title !== undefined ? taskData.title : existingTask.title,
        description: taskData.description !== undefined ? taskData.description : existingTask.description,
        deadline: taskData.deadline !== undefined ? taskData.deadline : existingTask.deadline,
        status: taskData.status !== undefined ? taskData.status : existingTask.status,
        departmentId: taskData.departmentId !== undefined ? taskData.departmentId : existingTask.department.departmentId,
        employeeId: taskData.employeeId !== undefined ? taskData.employeeId : existingTask.employee.employeeId,
    };

    return TaskModel.updateTask(taskId, dataToUpdate);
  },

  deleteTask: async (taskId) => {
    return TaskModel.deleteTask(taskId);
  },

  getTasksByDepartment: async (departmentId) => {
    return TaskModel.getTasksByDepartment(departmentId);
  },

  getTasksByEmployee: async (employeeId) => {
    return TaskModel.getTasksByEmployee(employeeId);
  }
};

module.exports = TaskService; 