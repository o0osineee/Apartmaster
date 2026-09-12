const EmployeeModel = require('../models/employeeModel');
const bcrypt = require('bcryptjs');

const EmployeeService = {
  getAllEmployees: async () => {
    return EmployeeModel.getAll();
  },

  getEmployeesByDepartment: async (departmentId) => {
    return EmployeeModel.getByDepartmentId(departmentId);
  },

  getEmployeeById: async (id) => {
    return EmployeeModel.getById(id);
  },

  createEmployee: async (employeeData) => {
    // Hash password before saving
    if (employeeData.password) {
      const salt = await bcrypt.genSalt(10);
      employeeData.password = await bcrypt.hash(employeeData.password, salt);
    }
    return EmployeeModel.create(employeeData);
  },

  updateEmployee: async (id, employeeData) => {
    // Hash password if it's being updated
    if (employeeData.password) {
      const salt = await bcrypt.genSalt(10);
      employeeData.password = await bcrypt.hash(employeeData.password, salt);
    }
    return EmployeeModel.update(id, employeeData);
  },

  deleteEmployee: async (id) => {
    return EmployeeModel.softDelete(id);
  }
};

module.exports = EmployeeService; 