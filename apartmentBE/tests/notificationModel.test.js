jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../src/config/database');
const Notification = require('../src/models/notificationModel');

describe('notificationModel recipient methods (regression for BUG-03)', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  describe('getNotificationsByRecipient', () => {
    it('queries by employeeId when recipientType is "employee"', async () => {
      db.query.mockResolvedValueOnce([[{ notificationId: 1, employeeId: 5 }]]);

      const result = await Notification.getNotificationsByRecipient(5, 'employee');

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query.mock.calls[0][1]).toEqual([5]);
      expect(result).toEqual([{ notificationId: 1, employeeId: 5 }]);
    });

    it('returns an empty array (not an error) for unsupported recipient types, since the schema has no generic recipient column', async () => {
      const result = await Notification.getNotificationsByRecipient(5, 'resident');

      expect(db.query).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('markAsRead / markAllAsRead / getUnreadCount', () => {
    it('markAsRead sets isRead=TRUE and returns a truthy result on success', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const result = await Notification.markAsRead(1);
      expect(result).toEqual({ id: 1, isRead: true });
    });

    it('markAsRead returns null when nothing matched (controller maps this to 404)', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
      const result = await Notification.markAsRead(999);
      expect(result).toBeNull();
    });

    it('markAllAsRead scopes to employeeId and reports affectedRows', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 3 }]);
      const result = await Notification.markAllAsRead(5, 'employee');
      expect(result).toEqual({ affectedRows: 3 });
    });

    it('getUnreadCount returns 0 for unsupported recipient types without querying', async () => {
      const count = await Notification.getUnreadCount(5, 'resident');
      expect(db.query).not.toHaveBeenCalled();
      expect(count).toBe(0);
    });

    it('getUnreadCount returns the count for employee recipients', async () => {
      db.query.mockResolvedValueOnce([[{ count: 4 }]]);
      const count = await Notification.getUnreadCount(5, 'employee');
      expect(count).toBe(4);
    });
  });
});
