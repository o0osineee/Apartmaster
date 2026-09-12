const db = require('../config/database');

const ServiceModel = {
  // Lấy tất cả dịch vụ
  async getAll() {
    try {
      const query = `
        SELECT 
          s.serviceId, s.name, s.description, s.feeId,
          f.name as feeName, f.type as feeType, f.price as feePrice,
          s.createdAt, s.updatedAt
        FROM Service s
        JOIN Fee f ON s.feeId = f.feeId
        WHERE s.isDeleted = FALSE AND f.isDeleted = FALSE
        ORDER BY s.createdAt DESC
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Lấy thông tin một dịch vụ theo ID
  async getById(id) {
    try {
      const query = `
        SELECT 
          s.serviceId, s.name, s.description, s.feeId,
          f.name as feeName, f.type as feeType, f.price as feePrice,
          s.createdAt, s.updatedAt
        FROM Service s
        JOIN Fee f ON s.feeId = f.feeId
        WHERE s.serviceId = ? AND s.isDeleted = FALSE AND f.isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error fetching service with id ${id}:`, error);
      throw error;
    }
  },

  // Tìm dịch vụ theo tên
  async findByName(name) {
    try {
      const query = `
        SELECT * FROM Service 
        WHERE name = ? AND isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [name]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding service by name:', error);
      throw error;
    }
  },

  // Kiểm tra feeId có tồn tại không
  async validateFeeId(feeId) {
    try {
      const query = `
        SELECT feeId FROM Fee 
        WHERE feeId = ? AND isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [feeId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error validating fee ID:', error);
      throw error;
    }
  },

  // Tạo dịch vụ mới
  async create(serviceData) {
    try {
      const { name, description, feeId } = serviceData;
      const query = `
        INSERT INTO Service (name, description, feeId)
        VALUES (?, ?, ?)
      `;
      const [result] = await db.query(query, [name, description, feeId]);
      return { serviceId: result.insertId, ...serviceData };
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Cập nhật thông tin dịch vụ
  async update(id, serviceData) {
    try {
      const { name, description, feeId } = serviceData;
      const query = `
        UPDATE Service 
        SET name = ?, description = ?, feeId = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE serviceId = ? AND isDeleted = FALSE
      `;
      const [result] = await db.query(query, [name, description, feeId, id]);
      if (result.affectedRows === 0) return null;
      return { serviceId: id, ...serviceData };
    } catch (error) {
      console.error(`Error updating service with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa dịch vụ (soft delete)
  async softDelete(id) {
    try {
      const query = `
        UPDATE Service 
        SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP
        WHERE serviceId = ? AND isDeleted = FALSE
      `;
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting service with id ${id}:`, error);
      throw error;
    }
  },

  // Lấy danh sách cư dân đăng ký dịch vụ
  async getRegisteredResidents(serviceId) {
    try {
      const query = `
        SELECT DISTINCT
          res.residentId, res.fullName, res.birthDate, res.gender, 
          res.idNumber, res.phone, res.email, res.username, res.status,
          r.name as roleName,
          sr.startDate,
          sr.endDate,
          sr.rating
        FROM Service s
        JOIN Service_Resident sr ON s.serviceId = sr.serviceId
        JOIN Resident res ON sr.residentId = res.residentId
        JOIN Role r ON res.roleId = r.roleId
        WHERE s.serviceId = ? 
          AND s.isDeleted = FALSE
          AND sr.isDeleted = FALSE
          AND res.isDeleted = FALSE
          AND r.isDeleted = FALSE
        ORDER BY sr.startDate DESC
      `;
      const [rows] = await db.query(query, [serviceId]);
      return rows;
    } catch (error) {
      console.error('Error fetching registered residents:', error);
      throw error;
    }
  }
};

module.exports = ServiceModel; 