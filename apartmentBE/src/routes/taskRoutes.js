const express = require('express');
const TaskController = require('../controllers/taskController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createTaskSchema, updateTaskSchema } = require('../validations/taskValidation');

const router = express.Router();

// Create a new task
router.post('/', validateRequest(createTaskSchema), TaskController.createTask);

// Get all tasks
router.get('/', TaskController.getAllTasks);

// Get tasks by department ID
router.get('/department/:departmentId', TaskController.getTasksByDepartment);

// Get tasks by employee ID
router.get('/employee/:employeeId', TaskController.getTasksByEmployee);

// Get a single task by ID
router.get('/:id', TaskController.getTaskById);

// Update a task by ID
router.put('/:id', validateRequest(updateTaskSchema), TaskController.updateTask);

// Delete a task by ID (soft delete)
router.delete('/:id', TaskController.deleteTask);

module.exports = router; 