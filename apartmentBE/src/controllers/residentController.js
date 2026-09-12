const ResidentService = require('../services/residentService');
const ResidentApartment = require('../models/residentApartmentModel');
const db = require('../config/database');
const { createResidentSchema } = require('../validations/residentValidation');
const bcrypt = require('bcrypt');

const ResidentController = {
  getAllResidents: async (req, res, next) => {
    try {
      const residents = await ResidentService.getAllResidents();
      res.status(200).json({ success: true, data: residents });
    } catch (error) {
      next(error);
    }
  },

  getResidentById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const resident = await ResidentService.getResidentById(id);
      if (!resident) {
        const err = new Error('Resident not found');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: resident });
    } catch (error) {
      next(error);
    }
  },

  createResident: async (req, res) => {
    const connection = await db.getConnection();
    try {
      // Log the incoming request body for debugging
      console.log('Received request body:', req.body);

      const { error } = createResidentSchema.validate(req.body, { abortEarly: false });
      if (error) {
        console.log('Validation errors:', error.details);
        const errorMessages = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }));
        return res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages
        });
      }

      await connection.beginTransaction();

      // Set default values
      const residentData = {
        ...req.body,
        username: req.body.username || req.body.idNumber,
        password: req.body.password || req.body.idNumber,
        roleId: req.body.roleId || 6, // Default role for residents
        status: 1 // Active status
      };

      // Log the processed data for debugging
      console.log('Processed resident data:', { ...residentData, password: '[REDACTED]' });

      // Create resident
      const [result] = await connection.query(
        'INSERT INTO Resident (fullName, birthDate, gender, idNumber, phone, email, username, password, roleId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          residentData.fullName,
          residentData.birthDate || null,
          residentData.gender || null,
          residentData.idNumber,
          residentData.phone || null,
          residentData.email || null,
          residentData.username,
          await bcrypt.hash(residentData.password, 10),
          residentData.roleId,
          residentData.status
        ]
      );

      const residentId = result.insertId;

      // Handle apartment assignment if provided
      if (residentData.apartmentCode) {
        const [apartment] = await connection.query(
          'SELECT apartmentId FROM Apartment WHERE code = ? AND isDeleted = 0',
          [residentData.apartmentCode]
        );

        if (apartment.length === 0) {
          throw new Error('Căn hộ không tồn tại');
        }

        const apartmentId = apartment[0].apartmentId;

        // Check if apartment already has an owner
        if (residentData.isOwner) {
          const [existingOwner] = await connection.query(
            'SELECT * FROM Resident_Apartment WHERE apartmentId = ? AND isOwner = 1 AND isDeleted = 0',
            [apartmentId]
          );

          if (existingOwner.length > 0) {
            throw new Error('Căn hộ này đã có chủ hộ');
          }
        }

        // Create resident-apartment relationship
        await connection.query(
          'INSERT INTO Resident_Apartment (residentId, apartmentId, isOwner, moveInDate) VALUES (?, ?, ?, ?)',
          [residentId, apartmentId, residentData.isOwner ? 1 : 0, new Date()]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Thêm cư dân mới thành công',
        data: { residentId }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error in createResident:', error);
      
      if (error.message.includes('already exists')) {
        res.status(409).json({ message: error.message });
      } else if (error.message.includes('Căn hộ')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ 
          message: 'Lỗi server khi tạo cư dân mới',
          error: error.message 
        });
      }
    } finally {
      connection.release();
    }
  },

  updateResident: async (req, res, next) => {
    try {
      const { id } = req.params;
      const residentData = req.body;
      // delete residentData.password; // Mật khẩu không nên cập nhật ở đây
      // Nếu cho phép cập nhật roleId, cần validate cẩn thận
      // delete residentData.roleId; 

      const updatedResident = await ResidentService.updateResident(id, residentData);
      if (!updatedResident) {
        const err = new Error('Resident not found or not updated');
        err.statusCode = 404;
        return next(err);
      }
      const { password, ...residentResponse } = updatedResident;
      res.status(200).json({ success: true, data: residentResponse, message: 'Resident updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  deleteResident: async (req, res, next) => {
    try {
      const { id } = req.params;
      const success = await ResidentService.deleteResident(id);
      if (!success) {
        const err = new Error('Resident not found or already deleted');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Resident deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async findByIdNumber(req, res) {
    try {
      const { idNumber } = req.params;
      const resident = await ResidentService.findByIdNumber(idNumber);
      res.json({
        success: true,
        data: resident,
        message: 'Tìm thấy cư dân thành công'
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Không tìm thấy cư dân'
      });
    }
  },

  async getResidentsByServiceId(req, res) {
    try {
      const { serviceId } = req.params;
      const residents = await ResidentService.getResidentsByServiceId(serviceId);
      res.json({
        success: true,
        data: residents,
        message: 'Lấy danh sách cư dân đăng ký dịch vụ thành công'
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Không tìm thấy cư dân đăng ký dịch vụ'
      });
    }
  }
};

module.exports = ResidentController; 