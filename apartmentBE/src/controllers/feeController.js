const FeeService = require('../services/feeService');

const FeeController = {
  // Lấy tất cả phí
  async getAllFees(req, res) {
    try {
      const fees = await FeeService.getAllFees();
      res.json({
        success: true,
        data: fees,
        message: 'Lấy danh sách phí thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi server',
        error: error
      });
    }
  },

  // Lấy thông tin một phí theo ID
  async getFeeById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ success: false, message: 'Fee ID must be a number' });
      }
      const fee = await FeeService.getFeeById(id);
      res.json({
        success: true,
        data: fee,
        message: 'Lấy thông tin phí thành công'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy phí',
        error: error
      });
    }
  },

  // Tạo phí mới
  async createFee(req, res) {
    try {
      const feeData = req.body;
      const newFee = await FeeService.createFee(feeData);
      res.status(201).json({
        success: true,
        data: newFee,
        message: 'Tạo phí mới thành công'
      });
    } catch (error) {
      if (error.message === 'Tên phí đã tồn tại') {
        res.status(400).json({
          success: false,
          message: error.message,
          error: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || 'Lỗi server',
          error: error
        });
      }
    }
  },

  // Cập nhật thông tin phí
  async updateFee(req, res) {
    try {
      const { id } = req.params;
      const feeData = req.body;
      const updatedFee = await FeeService.updateFee(id, feeData);
      res.json({
        success: true,
        data: updatedFee,
        message: 'Cập nhật thông tin phí thành công'
      });
    } catch (error) {
      if (error.message === 'Không tìm thấy phí') {
        res.status(404).json({
          success: false,
          message: error.message,
          error: error
        });
      } else if (error.message === 'Tên phí đã tồn tại') {
        res.status(400).json({
          success: false,
          message: error.message,
          error: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || 'Lỗi server',
          error: error
        });
      }
    }
  },

  // Xóa phí (soft delete)
  async deleteFee(req, res) {
    try {
      const { id } = req.params;
      const result = await FeeService.deleteFee(id);
      res.json({
        success: true,
        message: 'Xóa phí thành công'
      });
    } catch (error) {
      if (error.message === 'Không tìm thấy phí') {
        res.status(404).json({
          success: false,
          message: error.message,
          error: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || 'Lỗi server',
          error: error
        });
      }
    }
  }
};

module.exports = FeeController; 