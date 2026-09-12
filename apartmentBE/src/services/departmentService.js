const DepartmentModel = require('../models/departmentModel');

const DepartmentService = {
  getAllDepartments: async () => {
    return DepartmentModel.getAll();
  },

  getDepartmentById: async (id) => {
    return DepartmentModel.getById(id);
  },

  createDepartment: async (departmentData) => {
    return DepartmentModel.create(departmentData);
  },

  updateDepartment: async (id, departmentData) => {
    return DepartmentModel.update(id, departmentData);
  },

  deleteDepartment: async (id) => {
    return DepartmentModel.softDelete(id);
  }
};

module.exports = DepartmentService; 