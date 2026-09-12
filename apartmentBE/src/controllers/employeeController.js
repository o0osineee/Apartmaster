const EmployeeService = require('../services/employeeService');

const EmployeeController = {
  getAllEmployees: async (req, res, next) => {
    try {
      const employees = await EmployeeService.getAllEmployees();
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  },

  getEmployeesByDepartment: async (req, res, next) => {
    try {
      const { departmentId } = req.params;
      if (isNaN(parseInt(departmentId))) {
        return res.status(400).json({
          success: false,
          message: 'ID phòng ban không hợp lệ.',
          error: 'INVALID_DEPARTMENT_ID'
        });
      }
      const employees = await EmployeeService.getEmployeesByDepartment(parseInt(departmentId));
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  },

  getEmployeeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const employee = await EmployeeService.getEmployeeById(id);
      if (!employee) {
        const err = new Error('Employee not found');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: employee });
    } catch (error) {
      next(error);
    }
  },

  createEmployee: async (req, res, next) => {
    try {
      const employeeData = req.body;
      const newEmployee = await EmployeeService.createEmployee(employeeData);
      // Không trả về mật khẩu trong response
      const { password, ...employeeResponse } = newEmployee;
      res.status(201).json({ success: true, data: employeeResponse, message: 'Employee created successfully' });
    } catch (error) {
      next(error);
    }
  },

  updateEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const employeeData = req.body;
      // Nếu có mật khẩu trong request body và bạn không muốn xử lý nó ở đây, hãy loại bỏ nó
      // Hoặc nếu bạn cho phép cập nhật mật khẩu, đảm bảo nó được hash trong service.
      // delete employeeData.password; 

      const updatedEmployee = await EmployeeService.updateEmployee(id, employeeData);
      if (!updatedEmployee) {
        const err = new Error('Employee not found or not updated');
        err.statusCode = 404;
        return next(err);
      }
      const { password, ...employeeResponse } = updatedEmployee;
      res.status(200).json({ success: true, data: employeeResponse, message: 'Employee updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  deleteEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const success = await EmployeeService.deleteEmployee(id);
      if (!success) {
        const err = new Error('Employee not found or already deleted');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = EmployeeController; 