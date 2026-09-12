const db = require('../config/database');

const Resident = {
  getAll: async () => {
    try {
      // Lấy thêm tên Role cho Resident
      const query = `
        SELECT 
          res.residentId, res.fullName, res.birthDate, res.gender, 
          res.idNumber, res.phone, res.email, res.username, res.status,
          r.name as roleName
        FROM Resident res
        JOIN Role r ON res.roleId = r.roleId
        WHERE res.isDeleted = FALSE
      `;
      const [rows] = await db.query(query);

      // Lấy thông tin căn hộ cho từng cư dân
      const residentsWithApartments = await Promise.all(
        rows.map(async (resident) => {
          const apartmentsQuery = `
            SELECT 
              a.apartmentId,
              a.code as apartmentCode,
              a.building,
              a.floor,
              a.area,
              a.status,
              a.contract,
              ra.isOwner,
              ra.moveInDate,
              ra.moveOutDate,
              ra.isDeleted as assignmentIsDeleted
            FROM Resident_Apartment ra
            JOIN Apartment a ON ra.apartmentId = a.apartmentId
            WHERE ra.residentId = ? 
              AND a.isDeleted = FALSE
              AND ra.isDeleted = FALSE
            ORDER BY ra.moveInDate DESC
          `;
          const [apartments] = await db.query(apartmentsQuery, [resident.residentId]);
          
          return {
            ...resident,
            apartments: apartments.map(apt => ({
              apartmentId: apt.apartmentId,
              apartmentCode: apt.apartmentCode,
              building: apt.building,
              floor: apt.floor,
              area: apt.area,
              status: apt.status,
              contract: apt.contract,
              isOwner: apt.isOwner,
              moveInDate: apt.moveInDate,
              moveOutDate: apt.moveOutDate,
              assignmentIsDeleted: apt.assignmentIsDeleted
            }))
          };
        })
      );

      return residentsWithApartments;
    } catch (error) {
      console.error('Error fetching residents:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      // Get resident basic information
      const query = `
        SELECT 
          res.residentId, res.fullName, res.birthDate, res.gender, 
          res.idNumber, res.phone, res.email, res.username, res.status,
          r.name as roleName
        FROM Resident res
        JOIN Role r ON res.roleId = r.roleId
        WHERE res.residentId = ? AND res.isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [id]);
      if (!rows[0]) return null;

      // Get resident's apartments
      const apartmentsQuery = `
        SELECT 
          a.apartmentId,
          a.code,
          a.building,
          a.floor,
          a.area,
          a.status,
          a.contract,
          ra.isOwner,
          ra.moveInDate,
          ra.moveOutDate,
          ra.isDeleted as assignmentIsDeleted
        FROM Resident_Apartment ra
        JOIN Apartment a ON ra.apartmentId = a.apartmentId
        WHERE ra.residentId = ? 
          AND a.isDeleted = FALSE
        ORDER BY ra.isDeleted ASC, ra.moveInDate DESC
      `;
      const [apartments] = await db.query(apartmentsQuery, [id]);

      // Combine resident info with apartments
      return {
        ...rows[0],
        apartments: apartments.map(apt => ({
          apartmentId: apt.apartmentId,
          code: apt.code,
          building: apt.building,
          floor: apt.floor,
          area: apt.area,
          status: apt.status,
          contract: apt.contract,
          isOwner: apt.isOwner,
          moveInDate: apt.moveInDate,
          moveOutDate: apt.moveOutDate,
          assignmentIsDeleted: apt.assignmentIsDeleted
        }))
      };
    } catch (error) {
      console.error(`Error fetching resident with id ${id}:`, error);
      throw error;
    }
  },

  create: async (residentData) => {
    const {
      fullName, birthDate, gender, idNumber, phone, email, 
      username, password,
      roleId
    } = residentData;
    try {
      // Kiểm tra xem có bản ghi đã bị xóa mềm không
      const [existingDeleted] = await db.query(
        'SELECT * FROM Resident WHERE (idNumber = ? OR email = ? OR username = ?) AND isDeleted = TRUE',
        [idNumber, email, username]
      );

      // Nếu có bản ghi đã bị xóa mềm, tạo mới cư dân với thông tin mới
      if (existingDeleted.length > 0) {
        const [result] = await db.query(
          'INSERT INTO Resident (fullName, birthDate, gender, idNumber, phone, email, username, password, roleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [fullName, birthDate, gender, idNumber, phone, email, username, password, roleId]
        );
        return { id: result.insertId, ...residentData };
      }

      // Kiểm tra xem có bản ghi chưa bị xóa không
      const [existingActive] = await db.query(
        'SELECT * FROM Resident WHERE (idNumber = ? OR email = ? OR username = ?) AND isDeleted = FALSE',
        [idNumber, email, username]
      );

      if (existingActive.length > 0) {
        if (existingActive[0].idNumber === idNumber) { const err = new Error('ID number already exists.'); err.statusCode = 409; throw err; }
        if (existingActive[0].email === email) { const err = new Error('Email already exists.'); err.statusCode = 409; throw err; }
        if (existingActive[0].username === username) { const err = new Error('Username already exists.'); err.statusCode = 409; throw err; }
      }

      // Nếu không có bản ghi nào tồn tại, tạo mới
      const [result] = await db.query(
        'INSERT INTO Resident (fullName, birthDate, gender, idNumber, phone, email, username, password, roleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [fullName, birthDate, gender, idNumber, phone, email, username, password, roleId]
      );
      return { id: result.insertId, ...residentData };
    } catch (error) {
      console.error('Error creating resident:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        // Kiểm tra xem có bản ghi chưa bị xóa không
        const [existingActive] = await db.query(
          'SELECT * FROM Resident WHERE (idNumber = ? OR email = ? OR username = ?) AND isDeleted = FALSE',
          [idNumber, email, username]
        );
        if (existingActive.length > 0) {
          if (existingActive[0].idNumber === idNumber) { const err = new Error('ID number already exists.'); err.statusCode = 409; throw err; }
          if (existingActive[0].email === email) { const err = new Error('Email already exists.'); err.statusCode = 409; throw err; }
          if (existingActive[0].username === username) { const err = new Error('Username already exists.'); err.statusCode = 409; throw err; }
        }
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid roleId provided for resident.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  update: async (id, residentData) => {
    const {
      fullName, birthDate, gender, idNumber, phone, email, 
      username, status, roleId
      // Mật khẩu thường không cập nhật ở đây
    } = residentData;
    try {
      const [check] = await db.query('SELECT * FROM Resident WHERE residentId = ? AND isDeleted = FALSE', [id]);
      if (check.length === 0) return null;

      const [result] = await db.query(
        'UPDATE Resident SET fullName = ?, birthDate = ?, gender = ?, idNumber = ?, phone = ?, email = ?, username = ?, status = ?, roleId = ?, updatedAt = CURRENT_TIMESTAMP WHERE residentId = ? AND isDeleted = FALSE',
        [fullName, birthDate, gender, idNumber, phone, email, username, status, roleId, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, ...residentData };
    } catch (error) {
      console.error(`Error updating resident with id ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('idNumber')) { const err = new Error('ID number already exists.'); err.statusCode = 409; throw err; }
        if (error.sqlMessage.includes('email')) { const err = new Error('Email already exists.'); err.statusCode = 409; throw err; }
        if (error.sqlMessage.includes('username')) { const err = new Error('Username already exists.'); err.statusCode = 409; throw err; }
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid roleId provided for resident.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const [result] = await db.query(
        'UPDATE Resident SET isDeleted = TRUE, status = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE residentId = ? AND isDeleted = FALSE',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting resident with id ${id}:`, error);
      throw error;
    }
  },

  async findByIdNumber(idNumber) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM Resident WHERE idNumber = ? AND isDeleted = false`,
        [idNumber]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding resident by idNumber:', error);
      throw error;
    }
  },

  async getResidentsByServiceId(serviceId) {
    try {
      const query = `
        SELECT DISTINCT
          res.residentId, res.fullName, res.birthDate, res.gender, 
          res.idNumber, res.phone, res.email, res.username, res.status,
          r.name as roleName,
          sr.registrationDate,
          sr.status as serviceStatus,
          sr.expiryDate
        FROM Resident res
        JOIN Role r ON res.roleId = r.roleId
        JOIN Service_Registration sr ON res.residentId = sr.residentId
        WHERE sr.serviceId = ? 
          AND res.isDeleted = FALSE
          AND sr.isDeleted = FALSE
        ORDER BY sr.registrationDate DESC
      `;
      const [rows] = await db.query(query, [serviceId]);
      return rows;
    } catch (error) {
      console.error('Error fetching residents by service:', error);
      throw error;
    }
  }
};

module.exports = Resident; 