const db = require('../config/database');

const ResidentApartment = {
  // Gán cư dân vào căn hộ
  assignResidentToApartment: async (data) => {
    const { residentId, apartmentId, isOwner, moveInDate } = data;
    try {
      console.log('Starting apartment assignment with data:', data);

      // Kiểm tra xem có bản ghi đã bị xóa mềm không
      const [existingDeleted] = await db.query(
        'SELECT * FROM Resident_Apartment WHERE residentId = ? AND apartmentId = ? AND isDeleted = TRUE',
        [residentId, apartmentId]
      );

      // Nếu có bản ghi đã bị xóa mềm, cập nhật lại
      if (existingDeleted.length > 0) {
        const [result] = await db.query(
          `UPDATE Resident_Apartment 
           SET isOwner = ?, moveInDate = ?, isDeleted = FALSE, updatedAt = CURRENT_TIMESTAMP 
           WHERE residentId = ? AND apartmentId = ? AND isDeleted = TRUE`,
          [isOwner, moveInDate, residentId, apartmentId]
        );
        return { residentId, apartmentId, isOwner, moveInDate, id: existingDeleted[0].id };
      }

      // Kiểm tra xem có bản ghi chưa bị xóa không
      const [existingActive] = await db.query(
        'SELECT * FROM Resident_Apartment WHERE residentId = ? AND apartmentId = ? AND isDeleted = FALSE',
        [residentId, apartmentId]
      );

      if (existingActive.length > 0) {
        { const err = new Error('Cư dân đã được gán vào căn hộ này.'); err.statusCode = 409; throw err; }
      }

      // Thêm bản ghi mới
      const [result] = await db.query(
        `INSERT INTO Resident_Apartment 
         (residentId, apartmentId, isOwner, moveInDate, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [residentId, apartmentId, isOwner, moveInDate]
      );

      return { residentId, apartmentId, isOwner, moveInDate, id: result.insertId };
    } catch (error) {
      console.error('Error in assignResidentToApartment:', error);
      throw error;
    }
  },

  // Cập nhật thông tin quan hệ
  updateAssignment: async (residentId, apartmentId, updateData) => {
    const { isOwner, moveInDate, moveOutDate } = updateData;
    try {
      // Kiểm tra xem có bản ghi đã bị xóa mềm không
      const [existingDeleted] = await db.query(
        'SELECT * FROM Resident_Apartment WHERE residentId = ? AND apartmentId = ? AND isDeleted = TRUE',
        [residentId, apartmentId]
      );

      // Nếu có bản ghi đã bị xóa mềm, cập nhật lại
      if (existingDeleted.length > 0) {
        const [result] = await db.query(
          `UPDATE Resident_Apartment 
           SET isOwner = ?, moveInDate = ?, moveOutDate = ?, isDeleted = FALSE, updatedAt = CURRENT_TIMESTAMP 
           WHERE residentId = ? AND apartmentId = ? AND isDeleted = TRUE`,
          [isOwner, moveInDate, moveOutDate, residentId, apartmentId]
        );
        return { residentId, apartmentId, ...updateData };
      }

      // Cập nhật bản ghi hiện tại
      const [result] = await db.query(
        `UPDATE Resident_Apartment 
         SET isOwner = ?, moveInDate = ?, moveOutDate = ?, updatedAt = CURRENT_TIMESTAMP 
         WHERE residentId = ? AND apartmentId = ? AND isDeleted = FALSE`,
        [isOwner, moveInDate, moveOutDate, residentId, apartmentId]
      );

      if (result.affectedRows === 0) {
        { const err = new Error('Không tìm thấy quan hệ cư dân-căn hộ để cập nhật.'); err.statusCode = 404; throw err; }
      }

      return { residentId, apartmentId, ...updateData };
    } catch (error) {
      console.error('Error updating resident-apartment assignment:', error);
      throw error;
    }
  },

  // Xóa mềm quan hệ cư dân-căn hộ
  removeRelationship: async (residentId, apartmentId) => {
    try {
      const [result] = await db.query(
        `UPDATE Resident_Apartment 
         SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP 
         WHERE residentId = ? AND apartmentId = ? AND isDeleted = FALSE`,
        [residentId, apartmentId]
      );

      if (result.affectedRows === 0) {
        { const err = new Error('Không tìm thấy quan hệ cư dân-căn hộ để xóa.'); err.statusCode = 404; throw err; }
      }

      return { message: 'Xóa quan hệ cư dân-căn hộ thành công.' };
    } catch (error) {
      console.error('Error removing resident-apartment relationship:', error);
      throw error;
    }
  },

  // Lấy căn hộ hiện tại của một cư dân
  getApartmentsByResident: async (residentId) => {
    try {
      const query = `
        SELECT 
          ra.residentId, ra.apartmentId, ra.isOwner, ra.moveInDate, ra.moveOutDate,
          a.code as apartmentCode, a.building, a.floor, a.area
        FROM Resident_Apartment ra
        JOIN Apartment a ON ra.apartmentId = a.apartmentId
        WHERE ra.residentId = ? 
          AND ra.isDeleted = FALSE 
          AND a.isDeleted = FALSE
        ORDER BY ra.moveInDate DESC
      `;
      const [rows] = await db.query(query, [residentId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching apartments for resident ${residentId}:`, error);
      throw error;
    }
  },

  // Lấy tất cả cư dân của một căn hộ
  getResidentsByApartment: async (apartmentId) => {
    try {
      const query = `
        SELECT 
          ra.residentId, ra.apartmentId, ra.isOwner, ra.moveInDate, ra.moveOutDate,
          r.fullName as residentName, r.phone as residentPhone, r.email as residentEmail
        FROM Resident_Apartment ra
        JOIN Resident r ON ra.residentId = r.residentId
        WHERE ra.apartmentId = ? 
          AND ra.isDeleted = FALSE 
          AND r.isDeleted = FALSE
        ORDER BY ra.moveInDate DESC
      `;
      const [rows] = await db.query(query, [apartmentId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching residents for apartment ${apartmentId}:`, error);
      throw error;
    }
  },
  
  // Lấy thông tin cụ thể của một assignment
  getSpecificAssignment: async (residentId, apartmentId) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Resident_Apartment WHERE residentId = ? AND apartmentId = ? AND moveOutDate IS NULL AND isDeleted = FALSE',
        [residentId, apartmentId]
      );
      return rows[0]; // Trả về bản ghi active hiện tại
    } catch (error) {
      console.error('Error fetching specific assignment:', error);
      throw error;
    }
  },

  assignApartment: async (residentId, apartmentId, isOwner) => {
    try {
      // Kiểm tra xem căn hộ đã có chủ hộ chưa nếu isOwner = true
      if (isOwner) {
        const [existingOwner] = await db.query(
          `SELECT * FROM Resident_Apartment 
           WHERE apartmentId = ? AND isOwner = 1 AND isDeleted = FALSE`,
          [apartmentId]
        );
        if (existingOwner.length > 0) {
          { const err = new Error('Căn hộ này đã có chủ hộ'); err.statusCode = 409; throw err; }
        }
      }

      // Thêm bản ghi mới vào Resident_Apartment
      const [result] = await db.query(
        `INSERT INTO Resident_Apartment 
         (residentId, apartmentId, isOwner, moveInDate) 
         VALUES (?, ?, ?, CURRENT_DATE)`,
        [residentId, apartmentId, isOwner ? 1 : 0]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error assigning apartment:', error);
      throw error;
    }
  },

  getApartmentByCode: async (code) => {
    try {
      console.log('Looking up apartment with code:', code);
      const [rows] = await db.query(
        `SELECT apartmentId, code, building, floor FROM Apartment 
         WHERE code = ? AND isDeleted = FALSE`,
        [code]
      );
      console.log('Found apartment:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Error in getApartmentByCode:', error);
      throw error;
    }
  },

  setMoveOutDate: async (residentId, apartmentId, moveOutDate) => {
    try {
      const [result] = await db.query(
        `UPDATE Resident_Apartment 
         SET moveOutDate = ?, updatedAt = CURRENT_TIMESTAMP 
         WHERE residentId = ? AND apartmentId = ? AND isDeleted = FALSE`,
        [moveOutDate, residentId, apartmentId]
      );

      if (result.affectedRows === 0) {
        { const err = new Error('Không tìm thấy quan hệ cư dân-căn hộ để cập nhật.'); err.statusCode = 404; throw err; }
      }

      return { residentId, apartmentId, moveOutDate };
    } catch (error) {
      console.error('Error setting move out date:', error);
      throw error;
    }
  }
};

module.exports = ResidentApartment; 