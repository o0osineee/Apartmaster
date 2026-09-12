const db = require('../config/database');

const Notification = {
  createNotification: async (notificationData) => {
    const { title, content, status, employeeId } = notificationData;
    try {
      const [result] = await db.query(
        'INSERT INTO Notification (title, content, status, employeeId) VALUES (?, ?, ?, ?)',
        [title, content, status, employeeId]
      );
      return { id: result.insertId, ...notificationData };
    } catch (error) {
      throw error;
    }
  },

  getAllNotifications: async () => {
    const [rows] = await db.query(`
      SELECT 
        n.notificationId, n.title, n.content, n.status,
        n.employeeId, n.createdAt, n.updatedAt, n.isDeleted,
        e.fullName as employeeName
      FROM Notification n
      LEFT JOIN Employee e ON n.employeeId = e.employeeId
      WHERE n.isDeleted = FALSE
      ORDER BY n.createdAt DESC
    `);
    return rows.map(row => ({
      notificationId: row.notificationId,
      title: row.title,
      content: row.content,
      status: row.status,
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  },

  getNotificationById: async (notificationId) => {
    const [rows] = await db.query(`
      SELECT 
        n.notificationId, n.title, n.content, n.status,
        n.employeeId, n.createdAt, n.updatedAt, n.isDeleted,
        e.fullName as employeeName
      FROM Notification n
      LEFT JOIN Employee e ON n.employeeId = e.employeeId
      WHERE n.notificationId = ? AND n.isDeleted = FALSE
    `, [notificationId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      notificationId: row.notificationId,
      title: row.title,
      content: row.content,
      status: row.status,
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  },

  updateNotification: async (notificationId, notificationData) => {
    const { title, content, status } = notificationData;
    try {
      const [result] = await db.query(
        'UPDATE Notification SET title = ?, content = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE notificationId = ? AND isDeleted = FALSE',
        [title, content, status, notificationId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: notificationId, ...notificationData };
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    const [result] = await db.query(
      'UPDATE Notification SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE notificationId = ? AND isDeleted = FALSE',
      [notificationId]
    );
    return result.affectedRows > 0;
  },

  getNotificationsByEmployee: async (employeeId) => {
    const [rows] = await db.query(`
      SELECT 
        n.notificationId, n.title, n.content, n.status,
        n.employeeId, n.createdAt, n.updatedAt,
        e.fullName as employeeName
      FROM Notification n
      LEFT JOIN Employee e ON n.employeeId = e.employeeId
      WHERE n.employeeId = ? AND n.isDeleted = FALSE
      ORDER BY n.createdAt DESC
    `, [employeeId]);
    return rows.map(row => ({
      notificationId: row.notificationId,
      title: row.title,
      content: row.content,
      status: row.status,
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  },

  updateStatus: async (notificationId, status) => {
    const [result] = await db.query(
      'UPDATE Notification SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE notificationId = ? AND isDeleted = FALSE',
      [status, notificationId]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { id: notificationId, status };
  },

  // LƯU Ý: bảng Notification hiện chỉ có employeeId (NOT NULL, FK tới Employee) —
  // chưa có khái niệm "recipient" chung cho cả resident lẫn employee ở tầng schema.
  // Các hàm dưới đây chỉ hỗ trợ recipientType === 'employee' (ánh xạ recipientId -> employeeId);
  // với các recipientType khác, trả về rỗng/0 thay vì lỗi, vì schema chưa có dữ liệu tương ứng.
  getNotificationsByRecipient: async (recipientId, recipientType) => {
    if (recipientType !== 'employee') return [];
    const [rows] = await db.query(`
      SELECT
        n.notificationId, n.title, n.content, n.status, n.isRead,
        n.employeeId, n.createdAt, n.updatedAt,
        e.fullName as employeeName
      FROM Notification n
      LEFT JOIN Employee e ON n.employeeId = e.employeeId
      WHERE n.employeeId = ? AND n.isDeleted = FALSE
      ORDER BY n.createdAt DESC
    `, [recipientId]);
    return rows;
  },

  markAsRead: async (notificationId) => {
    const [result] = await db.query(
      'UPDATE Notification SET isRead = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE notificationId = ? AND isDeleted = FALSE',
      [notificationId]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { id: notificationId, isRead: true };
  },

  markAllAsRead: async (recipientId, recipientType) => {
    if (recipientType !== 'employee') return { affectedRows: 0 };
    const [result] = await db.query(
      'UPDATE Notification SET isRead = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE employeeId = ? AND isRead = FALSE AND isDeleted = FALSE',
      [recipientId]
    );
    return { affectedRows: result.affectedRows };
  },

  getUnreadCount: async (recipientId, recipientType) => {
    if (recipientType !== 'employee') return 0;
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM Notification WHERE employeeId = ? AND isRead = FALSE AND isDeleted = FALSE',
      [recipientId]
    );
    return rows[0].count;
  }
};

module.exports = Notification; 