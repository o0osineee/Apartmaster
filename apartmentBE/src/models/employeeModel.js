const db = require('../config/database');

const Employee = {
  getAll: async () => {
    try {
      const query = `
        SELECT 
          e.employeeId, e.idNumber, e.fullName, e.gender, e.birthDate, 
          e.phone, e.email, e.startDate, e.endDate, e.username, e.status,
          r.name as roleName, r.roleId,
          d.name as departmentName, d.departmentId
        FROM Employee e
        JOIN Role r ON e.roleId = r.roleId
        JOIN Department d ON e.departmentId = d.departmentId
        WHERE e.isDeleted = FALSE
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query = `
        SELECT 
          e.employeeId, e.idNumber, e.fullName, e.gender, e.birthDate, 
          e.phone, e.email, e.startDate, e.endDate, e.username, e.status,
          r.name as roleName, r.roleId,
          d.name as departmentName, d.departmentId
        FROM Employee e
        JOIN Role r ON e.roleId = r.roleId
        JOIN Department d ON e.departmentId = d.departmentId
        WHERE e.employeeId = ? AND e.isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching employee with id ${id}:`, error);
      throw error;
    }
  },

  create: async (employeeData) => {
    const {
      idNumber, fullName, gender, birthDate, phone, email,
      startDate, endDate, username, password, status,
      roleId, departmentId
    } = employeeData;

    try {
      // Format dates to YYYY-MM-DD
      const formattedBirthDate = birthDate ? new Date(birthDate).toISOString().split('T')[0] : null;
      const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

      const [result] = await db.query(
        'INSERT INTO Employee (idNumber, fullName, gender, birthDate, phone, email, startDate, endDate, username, password, status, roleId, departmentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idNumber, fullName, gender, formattedBirthDate, phone, email, formattedStartDate, formattedEndDate, username, password, status, roleId, departmentId]
      );
      return { id: result.insertId, ...employeeData };
    } catch (error) {
      console.error('Error creating employee:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('idNumber')) { const err = new Error('ID number already exists.'); err.statusCode = 409; throw err; }
        if (error.sqlMessage.includes('email')) { const err = new Error('Email already exists.'); err.statusCode = 409; throw err; }
        if (error.sqlMessage.includes('username')) { const err = new Error('Username already exists.'); err.statusCode = 409; throw err; }
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid roleId or departmentId provided for employee.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  update: async (id, employeeData) => {
    const {
      idNumber, fullName, gender, birthDate, phone, email,
      startDate, endDate, username, status, roleId, departmentId
    } = employeeData;

    try {
      const [check] = await db.query('SELECT * FROM Employee WHERE employeeId = ? AND isDeleted = FALSE', [id]);
      if (check.length === 0) return null;

      // Format dates to YYYY-MM-DD
      const formattedBirthDate = birthDate ? new Date(birthDate).toISOString().split('T')[0] : null;
      const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

      const [result] = await db.query(
        'UPDATE Employee SET idNumber = ?, fullName = ?, gender = ?, birthDate = ?, phone = ?, email = ?, startDate = ?, endDate = ?, username = ?, status = ?, roleId = ?, departmentId = ?, updatedAt = CURRENT_TIMESTAMP WHERE employeeId = ? AND isDeleted = FALSE',
        [idNumber, fullName, gender, formattedBirthDate, phone, email, formattedStartDate, formattedEndDate, username, status, roleId, departmentId, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, ...employeeData };
    } catch (error) {
      console.error(`Error updating employee with id ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('idNumber')) { const err = new Error('ID number already exists.'); err.statusCode = 409; throw err; }
        if (error.sqlMessage.includes('email')) { const err = new Error('Email already exists.'); err.statusCode = 409; throw err; }
        if (error.sqlMessage.includes('username')) { const err = new Error('Username already exists.'); err.statusCode = 409; throw err; }
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid roleId or departmentId provided for employee.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const [result] = await db.query(
        'UPDATE Employee SET isDeleted = TRUE, status = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE employeeId = ? AND isDeleted = FALSE',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting employee with id ${id}:`, error);
      throw error;
    }
  },

  getByDepartmentId: async (departmentId) => {
    try {
      const query = `
        SELECT 
          e.employeeId, e.idNumber, e.fullName, e.gender, e.birthDate, 
          e.phone, e.email, e.startDate, e.endDate, e.username, e.status,
          r.name as roleName, r.roleId,
          d.name as departmentName, d.departmentId
        FROM Employee e
        JOIN Role r ON e.roleId = r.roleId
        JOIN Department d ON e.departmentId = d.departmentId
        WHERE e.departmentId = ? AND e.isDeleted = FALSE
        ORDER BY e.fullName ASC
      `;
      const [rows] = await db.query(query, [departmentId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching employees for department ${departmentId}:`, error);
      throw error;
    }
  }
  // Thêm hàm tìm theo username nếu cần cho việc đăng nhập
  // findByUsername: async (username) => { ... }
};

module.exports = Employee; 