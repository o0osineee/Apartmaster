const FeeModel = require('../models/feeModel');

const FeeService = {
  // Lấy tất cả phí
  async getAllFees() {
    try {
      return await FeeModel.getAll();
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin một phí theo ID
  async getFeeById(id) {
    try {
      const fee = await FeeModel.getById(id);
      if (!fee) {
        throw new Error('Không tìm thấy phí');
      }
      return fee;
    } catch (error) {
      throw error;
    }
  },

  // Tạo phí mới
  async createFee(feeData) {
    try {
      // Kiểm tra tên phí đã tồn tại chưa
      const existingFee = await FeeModel.findByName(feeData.name);
      if (existingFee) {
        throw new Error('Tên phí đã tồn tại');
      }

      return await FeeModel.create(feeData);
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin phí
  async updateFee(id, feeData) {
    try {
      // Kiểm tra phí có tồn tại không
      const existingFee = await FeeModel.getById(id);
      if (!existingFee) {
        throw new Error('Không tìm thấy phí');
      }

      // Nếu có cập nhật tên, kiểm tra tên mới có bị trùng không
      if (feeData.name && feeData.name !== existingFee.name) {
        const nameExists = await FeeModel.findByName(feeData.name);
        if (nameExists) {
          throw new Error('Tên phí đã tồn tại');
        }
      }

      return await FeeModel.update(id, feeData);
    } catch (error) {
      throw error;
    }
  },

  // Xóa phí (soft delete)
  async deleteFee(id) {
    try {
      const fee = await FeeModel.getById(id);
      if (!fee) {
        throw new Error('Không tìm thấy phí');
      }
      return await FeeModel.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = FeeService; 