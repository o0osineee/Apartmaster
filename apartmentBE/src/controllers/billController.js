const BillService = require('../services/billService');

const BillController = {
  getAllBills: async (req, res, next) => {
    try {
      const bills = await BillService.getAllBills();
      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  },

  calculateBill: async (req, res, next) => {
    try {
      const { apartmentId, month } = req.body;

      // Validate input
      if (!apartmentId || !month) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin căn hộ và tháng'
        });
      }

      // Validate month format (YYYY-MM)
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(month)) {
        return res.status(400).json({
          success: false,
          message: 'Định dạng tháng không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM'
        });
      }

      const result = await BillService.calculateBill(apartmentId, month);
      res.json({
        success: true,
        message: 'Tính hóa đơn thành công',
        data: result
      });
    } catch (error) {
      console.error('Error in calculateBill controller:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi tính hóa đơn'
      });
    }
  },

  updateBillPayment: async (req, res, next) => {
    try {
      const { billId } = req.params;
      const paymentData = req.body;
      const result = await BillService.updateBillPayment(billId, paymentData);
      res.json({
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  deleteBill: async (req, res, next) => {
    try {
      const { billId } = req.params;
      const result = await BillService.deleteBill(billId);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = BillController; 