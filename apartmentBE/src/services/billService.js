const db = require('../config/database');

const BillService = {
  getAllBills: async () => {
    const [bills] = await db.query(`
      SELECT b.*, a.code as apartmentCode 
      FROM Bill b
      JOIN Apartment a ON b.apartmentId = a.apartmentId
      WHERE b.isDeleted = false
      ORDER BY b.createdAt DESC
    `);
    return bills;
  },

  calculateBill: async (apartmentId, month) => {
    try {
      // Lấy thông tin phí của căn hộ từ bảng Apartment_Fee
      const [feeDetails] = await db.query(`
        SELECT 
          af.feeId,
          f.name as feeName,
          f.price as unitPrice,
          af.amount as weight,
          (f.price * af.amount) as total
        FROM Apartment_Fee af
        JOIN Fee f ON af.feeId = f.feeId
        WHERE af.apartmentId = ? 
          AND af.isDeleted = false
          AND f.isDeleted = false
      `, [apartmentId]);

      if (!feeDetails.length) {
        const err = new Error('Không tìm thấy thông tin phí của căn hộ');
        err.statusCode = 404;
        throw err;
      }

      // Tính tổng tiền và làm tròn đến 2 chữ số thập phân
      const totalMoney = Number(feeDetails.reduce((sum, fee) => {
        const feeTotal = parseFloat(fee.total) || 0;
        return sum + feeTotal;
      }, 0).toFixed(2));

      // Kiểm tra xem đã có hóa đơn cho tháng này chưa
      const [existingBill] = await db.query(`
        SELECT * FROM Bill 
        WHERE apartmentId = ? AND month = ? AND isDeleted = false
      `, [apartmentId, month]);

      if (existingBill.length > 0) {
        // Cập nhật hóa đơn hiện có
        await db.query(`
          UPDATE Bill 
          SET money = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE billId = ?
        `, [totalMoney, existingBill[0].billId]);

        return {
          ...existingBill[0],
          money: totalMoney,
          feeDetails: feeDetails.map(fee => ({
            ...fee,
            total: Number(parseFloat(fee.total || 0).toFixed(2))
          }))
        };
      } else {
        // Tạo hóa đơn mới
        const [result] = await db.query(`
          INSERT INTO Bill (apartmentId, month, money, isPaid)
          VALUES (?, ?, ?, false)
        `, [apartmentId, month, totalMoney]);

        return {
          billId: result.insertId,
          apartmentId,
          month,
          money: totalMoney,
          feeDetails: feeDetails.map(fee => ({
            ...fee,
            total: Number(parseFloat(fee.total || 0).toFixed(2))
          })),
          isPaid: false
        };
      }
    } catch (error) {
      console.error('Error calculating bill:', error);
      throw error;
    }
  },

  updateBillPayment: async (billId, paymentData) => {
    const [result] = await db.query(`
      UPDATE Bill 
      SET isPaid = ?, paymentMethod = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE billId = ? AND isDeleted = false
    `, [paymentData.isPaid, paymentData.paymentMethod, billId]);

    if (result.affectedRows === 0) {
      const err = new Error('Không tìm thấy hóa đơn hoặc hóa đơn đã bị xóa');
      err.statusCode = 404;
      throw err;
    }

    return { billId, ...paymentData };
  },

  deleteBill: async (billId) => {
    const [result] = await db.query(`
      UPDATE Bill 
      SET isDeleted = true, updatedAt = CURRENT_TIMESTAMP
      WHERE billId = ? AND isDeleted = false
    `, [billId]);

    if (result.affectedRows === 0) {
      const err = new Error('Không tìm thấy hóa đơn hoặc hóa đơn đã bị xóa');
      err.statusCode = 404;
      throw err;
    }

    return { message: 'Xóa hóa đơn thành công' };
  }
};

module.exports = BillService; 