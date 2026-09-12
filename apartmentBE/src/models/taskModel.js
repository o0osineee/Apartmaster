const db = require('../config/database');

const Task = {
  createTask: async (taskData) => {
    const { title, description, deadline, status, departmentId, employeeId } = taskData;
    try {
      const [result] = await db.query(
        'INSERT INTO Task (title, description, deadline, status, departmentId, employeeId) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, deadline, status, departmentId, employeeId]
      );
      return { id: result.insertId, ...taskData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid departmentId or employeeId. The specified department or employee does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  getAllTasks: async () => {
    const [rows] = await db.query(`
      SELECT 
        t.taskId, t.title, t.description, t.deadline, t.status, 
        t.createdAt, t.updatedAt, t.isDeleted,
        d.departmentId as task_departmentId, d.name as departmentName,
        e.employeeId as task_employeeId, e.fullName as employeeFullName, e.username as employeeUsername
      FROM Task t
      JOIN Department d ON t.departmentId = d.departmentId
      LEFT JOIN Employee e ON t.employeeId = e.employeeId
      WHERE t.isDeleted = FALSE AND d.isDeleted = FALSE
    `);
    return rows.map(row => ({
      taskId: row.taskId,
      title: row.title,
      description: row.description,
      deadline: row.deadline,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      department: {
        departmentId: row.task_departmentId,
        name: row.departmentName
      },
      employee: row.task_employeeId ? {
        employeeId: row.task_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      } : null
    }));
  },

  getTaskById: async (taskId) => {
    const [rows] = await db.query(`
      SELECT 
        t.taskId, t.title, t.description, t.deadline, t.status, 
        t.createdAt, t.updatedAt, t.isDeleted,
        d.departmentId as task_departmentId, d.name as departmentName,
        e.employeeId as task_employeeId, e.fullName as employeeFullName, e.username as employeeUsername
      FROM Task t
      JOIN Department d ON t.departmentId = d.departmentId
      LEFT JOIN Employee e ON t.employeeId = e.employeeId
      WHERE t.taskId = ? AND t.isDeleted = FALSE AND d.isDeleted = FALSE
    `, [taskId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      taskId: row.taskId,
      title: row.title,
      description: row.description,
      deadline: row.deadline,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      department: {
        departmentId: row.task_departmentId,
        name: row.departmentName
      },
      employee: row.task_employeeId ? {
        employeeId: row.task_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      } : null
    };
  },

  updateTask: async (taskId, taskData) => {
    const { title, description, deadline, status, departmentId, employeeId } = taskData;
    try {
      const [result] = await db.query(
        'UPDATE Task SET title = ?, description = ?, deadline = ?, status = ?, departmentId = ?, employeeId = ?, updatedAt = CURRENT_TIMESTAMP WHERE taskId = ? AND isDeleted = FALSE',
        [title, description, deadline, status, departmentId, employeeId, taskId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: taskId, ...taskData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid departmentId or employeeId for update.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    const [result] = await db.query(
      'UPDATE Task SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE taskId = ? AND isDeleted = FALSE',
      [taskId]
    );
    return result.affectedRows > 0;
  },

  getTasksByDepartment: async (departmentId) => {
    const [rows] = await db.query(`
      SELECT 
        t.taskId, t.title, t.description, t.deadline, t.status, 
        t.createdAt, t.updatedAt,
        e.employeeId as task_employeeId, e.fullName as employeeFullName, e.username as employeeUsername
      FROM Task t
      JOIN Employee e ON t.employeeId = e.employeeId
      WHERE t.departmentId = ? AND t.isDeleted = FALSE AND e.isDeleted = FALSE
      ORDER BY t.createdAt DESC
    `, [departmentId]);
    return rows.map(row => ({
      taskId: row.taskId,
      title: row.title,
      description: row.description,
      deadline: row.deadline,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      employee: {
        employeeId: row.task_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      }
    }));
  },

  getTasksByEmployee: async (employeeId) => {
    const [rows] = await db.query(`
      SELECT 
        t.taskId, t.title, t.description, t.deadline, t.status, 
        t.createdAt, t.updatedAt,
        d.departmentId as task_departmentId, d.name as departmentName
      FROM Task t
      JOIN Department d ON t.departmentId = d.departmentId
      WHERE t.employeeId = ? AND t.isDeleted = FALSE AND d.isDeleted = FALSE
      ORDER BY t.createdAt DESC
    `, [employeeId]);
    return rows.map(row => ({
      taskId: row.taskId,
      title: row.title,
      description: row.description,
      deadline: row.deadline,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      department: {
        departmentId: row.task_departmentId,
        name: row.departmentName
      }
    }));
  }
};

module.exports = Task; 