const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PermissionService = require('../services/permissionService');

// JWT secret key — bắt buộc phải cấu hình qua biến môi trường
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET chưa được cấu hình trong .env');
}

const AuthController = {
  // Lấy danh sách thông tin đăng nhập của resident và employee
  async getLoginInfo(req, res) {
    try {
      // Lấy danh sách resident với thông tin role
      const [residents] = await db.query(`
        SELECT 
          r.residentId as id,
          r.username,
          r.password,
          r.fullName,
          r.email,
          r.phone,
          r.status,
          r.roleId,
          role.name as roleName,
          role.description as roleDescription,
          GROUP_CONCAT(DISTINCT a.code) as apartmentCodes
        FROM Resident r
        LEFT JOIN Role role ON r.roleId = role.roleId
        LEFT JOIN Resident_Apartment ra ON r.residentId = ra.residentId AND ra.isDeleted = FALSE
        LEFT JOIN Apartment a ON ra.apartmentId = a.apartmentId AND a.isDeleted = FALSE
        WHERE r.isDeleted = FALSE
        GROUP BY r.residentId
      `);

      // Lấy danh sách employee với thông tin role và department
      const [employees] = await db.query(`
        SELECT 
          e.employeeId as id,
          e.username,
          e.password,
          e.fullName,
          e.email,
          e.phone,
          e.status,
          e.roleId,
          role.name as roleName,
          role.description as roleDescription,
          e.departmentId,
          d.name as departmentName,
          d.description as departmentDescription
        FROM Employee e
        LEFT JOIN Role role ON e.roleId = role.roleId
        LEFT JOIN Department d ON e.departmentId = d.departmentId
        WHERE e.isDeleted = FALSE
      `);

      // Kết hợp kết quả và thêm trường role để phân biệt
      const loginInfo = [
        ...residents.map(r => ({ ...r, role: 'resident' })),
        ...employees.map(e => ({ ...e, role: 'employee' }))
      ];

      return res.status(200).json({
        success: true,
        data: loginInfo,
        message: 'Lấy danh sách thông tin đăng nhập thành công'
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông tin đăng nhập:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Login function
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Check in both Resident and Employee tables
      const [residents] = await db.query(`
        SELECT 
          r.residentId as id,
          r.username,
          r.password,
          r.fullName,
          r.email,
          r.phone,
          r.status,
          r.roleId,
          role.name as roleName,
          role.description as roleDescription,
          'resident' as userType
        FROM Resident r
        LEFT JOIN Role role ON r.roleId = role.roleId
        WHERE r.username = ? AND r.isDeleted = FALSE
      `, [username]);

      const [employees] = await db.query(`
        SELECT 
          e.employeeId as id,
          e.username,
          e.password,
          e.fullName,
          e.email,
          e.phone,
          e.status,
          e.roleId,
          role.name as roleName,
          role.description as roleDescription,
          e.departmentId,
          d.name as departmentName,
          d.description as departmentDescription,
          'employee' as userType
        FROM Employee e
        LEFT JOIN Role role ON e.roleId = role.roleId
        LEFT JOIN Department d ON e.departmentId = d.departmentId
        WHERE e.username = ? AND e.isDeleted = FALSE
      `, [username]);

      const users = [...residents, ...employees];
      
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập không tồn tại'
        });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu không chính xác'
        });
      }

      if (!user.status) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị khóa'
        });
      }

      // Lấy danh sách quyền của user
      let permissions = [];
      if (user.userType === 'employee') {
        permissions = await PermissionService.getUserPermissions(user.roleId, user.departmentId);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.roleName,
          userType: user.userType,
          departmentId: user.departmentId,
          roleId: user.roleId
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      delete user.password;

      return res.status(200).json({
        success: true,
        data: {
          user,
          permissions,
          token
        },
        message: 'Đăng nhập thành công'
      });
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Update user password and status
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { password, status } = req.body;

      // Check if user exists in Resident table
      const [residents] = await db.query(`
        SELECT residentId, username, password, status
        FROM Resident
        WHERE residentId = ? AND isDeleted = FALSE
      `, [id]);

      // Check if user exists in Employee table
      const [employees] = await db.query(`
        SELECT employeeId, username, password, status
        FROM Employee
        WHERE employeeId = ? AND isDeleted = FALSE
      `, [id]);

      const users = [...residents, ...employees];
      
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      const user = users[0];
      const tableName = user.residentId ? 'Resident' : 'Employee';
      const idField = user.residentId ? 'residentId' : 'employeeId';
      const userId = user.residentId || user.employeeId;

      // Prepare update data
      const updateData = {};
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      if (status !== undefined) {
        updateData.status = status;
      }

      // Update user
      await db.query(`
        UPDATE ${tableName}
        SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}
        WHERE ${idField} = ?
      `, [...Object.values(updateData), userId]);

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin người dùng thành công'
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }
};

module.exports = AuthController; 