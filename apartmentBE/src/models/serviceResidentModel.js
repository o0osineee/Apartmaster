const db = require('../config/database');

const ServiceResident = {
  assignServiceToResident: async (data) => {
    const { serviceId, residentId, startDate, rating } = data;
    try {
      // Check for an existing non-deleted record (active or past with an endDate)
      const [existing] = await db.query(
        'SELECT * FROM Service_Resident WHERE serviceId = ? AND residentId = ? AND isDeleted = FALSE',
        [serviceId, residentId]
      );

      // If an active assignment (endDate IS NULL) exists, throw an error
      const activeAssignment = existing.find(a => a.endDate === null);
      if (activeAssignment) {
        { const err = new Error('Resident is already actively assigned to this service.'); err.statusCode = 409; throw err; }
      }

      // Check if a soft-deleted record exists for the same pair
      const [softDeleted] = await db.query(
        'SELECT * FROM Service_Resident WHERE serviceId = ? AND residentId = ? AND isDeleted = TRUE ORDER BY updatedAt DESC LIMIT 1',
        [serviceId, residentId]
      );

      if (softDeleted.length > 0) {
        // Reactivate and update the existing soft-deleted record
        const [updateResult] = await db.query(
          'UPDATE Service_Resident SET startDate = ?, endDate = NULL, rating = ?, isDeleted = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE serviceId = ? AND residentId = ? AND isDeleted = TRUE AND serviceResidentId = ?',
          [startDate || new Date(), rating, serviceId, residentId, softDeleted[0].serviceResidentId] // Assuming serviceResidentId is PK
        );
        // Note: The above query assumes a single auto-incrementing PK `serviceResidentId`.
        // If PK is (serviceId, residentId), the WHERE for softDeleted check is enough, and UPDATE WHERE should be based on (serviceId, residentId)
        // For a composite PK (serviceId, residentId) and if you want to uniquely identify a soft-deleted record to reactivate:
        // We need a way to pick THE soft-deleted record. If there are multiple, which one?
        // Simplest is to update based on (serviceId, residentId) AND isDeleted = TRUE. This would update ALL soft-deleted for that pair.
        // Let's assume for now the table has a unique PK like `serviceResidentId` for easier reactivation of a specific row.
        // If not, the logic might need to be simplified to just create new, or update the LATEST soft-deleted one.
        // Corrected UPDATE for composite key (serviceId, residentId) assuming we update the LATEST soft-deleted:
        // This is tricky if multiple soft-deleted exist. Let's stick to creating new if not active, and handle reactivation carefully or disallow multiple soft-deleted for same pair.
        
        // Let's simplify: if there's a soft-deleted record, reactivate THE LATEST one.
        // This requires a `serviceResidentId` or a unique timestamp logic for ordering. The schema provided doesn't show `serviceResidentId`
        // The schema has PRIMARY KEY (serviceId, residentId). So there can only be ONE record for a pair, whether active or soft-deleted.

        // Corrected logic for composite PK (serviceId, residentId):
        const [updateResultComposite] = await db.query(
          'UPDATE Service_Resident SET startDate = ?, endDate = NULL, rating = ?, isDeleted = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE serviceId = ? AND residentId = ? AND isDeleted = TRUE',
          [startDate || new Date(), rating, serviceId, residentId]
        );
         if (updateResultComposite.affectedRows > 0) {
            return { serviceId, residentId, startDate: startDate || new Date(), rating, message: 'Reactivated and updated existing assignment.' };
        }
      }

      // No active record, and no soft-deleted record reactivated, create new
      const [result] = await db.query(
        'INSERT INTO Service_Resident (serviceId, residentId, startDate, rating) VALUES (?, ?, ?, ?)',
        [serviceId, residentId, startDate || new Date(), rating]
      );
      return { serviceId, residentId, startDate: startDate || new Date(), rating };
    } catch (error) {
      console.error('Error assigning service to resident:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid serviceId or residentId.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  updateServiceAssignment: async (serviceId, residentId, updateData) => {
    const { startDate, endDate, rating } = updateData;
    try {
      const [result] = await db.query(
        'UPDATE Service_Resident SET startDate = COALESCE(?, startDate), endDate = ?, rating = COALESCE(?, rating), updatedAt = CURRENT_TIMESTAMP WHERE serviceId = ? AND residentId = ? AND isDeleted = FALSE',
        // We should only update an ACTIVE assignment, so `endDate IS NULL` was correct for that target. 
        // However, the table definition allows only ONE record per (serviceId, residentId) due to PK constraint.
        // So, `isDeleted = FALSE` is enough to target the single non-deleted record for update.
        [startDate, endDate, rating, serviceId, residentId]
      );
      if (result.affectedRows === 0) {
        { const err = new Error('No non-deleted assignment found for this service and resident to update, or no changes made.'); err.statusCode = 404; throw err; }
      }
      return { serviceId, residentId, ...updateData };
    } catch (error) {
      console.error('Error updating service assignment:', error);
      throw error;
    }
  },

  removeServiceFromResident: async (serviceId, residentId) => {
    try {
      // Set isDeleted = TRUE. If they were active (endDate was NULL), set endDate to now.
      const [result] = await db.query(
        'UPDATE Service_Resident SET isDeleted = TRUE, endDate = IF(endDate IS NULL, CURRENT_TIMESTAMP, endDate), updatedAt = CURRENT_TIMESTAMP WHERE serviceId = ? AND residentId = ? AND isDeleted = FALSE',
        [serviceId, residentId]
      );
      if (result.affectedRows === 0) {
        { const err = new Error('No active assignment found to remove.'); err.statusCode = 404; throw err; }
      }
      return { message: 'Service assignment removed (soft deleted) successfully.' };
    } catch (error) {
      console.error('Error removing service from resident:', error);
      throw error;
    }
  },

  getServicesByResident: async (residentId) => {
    try {
      const query = `
        SELECT 
          sr.serviceId, sr.residentId, sr.startDate, sr.endDate, sr.rating, sr.createdAt as assignmentCreatedAt, sr.updatedAt as assignmentUpdatedAt, sr.isDeleted as assignmentIsDeleted,
          s.name as serviceName, s.description as serviceDescription,
          f.feeId as feeId, f.name as feeName, f.type as feeType, f.price as feePrice
        FROM Service_Resident sr
        JOIN Service s ON sr.serviceId = s.serviceId
        JOIN Fee f ON s.feeId = f.feeId
        WHERE sr.residentId = ? 
          AND s.isDeleted = FALSE 
          AND f.isDeleted = FALSE 
        ORDER BY sr.isDeleted ASC, sr.startDate DESC, sr.createdAt DESC
      `; // Show non-deleted assignments first
      const [rows] = await db.query(query, [residentId]);
      return rows.map(row => ({
        serviceId: row.serviceId,
        residentId: row.residentId,
        startDate: row.startDate,
        endDate: row.endDate,
        rating: row.rating,
        assignmentCreatedAt: row.assignmentCreatedAt,
        assignmentUpdatedAt: row.assignmentUpdatedAt,
        assignmentIsDeleted: !!row.assignmentIsDeleted,
        service: {
            serviceId: row.serviceId, // Add serviceId here too for convenience
            name: row.serviceName,
            description: row.serviceDescription,
            fee: {
                feeId: row.feeId,
                name: row.feeName,
                type: row.feeType,
                price: row.feePrice
            }
        }
      }));
    } catch (error) {
      console.error(`Error fetching services for resident ${residentId}:`, error);
      throw error;
    }
  },

  getResidentsByService: async (serviceId) => {
    try {
      const query = `
        SELECT 
          sr.serviceId, sr.residentId, sr.startDate, sr.endDate, sr.rating, sr.createdAt as assignmentCreatedAt, sr.updatedAt as assignmentUpdatedAt, sr.isDeleted as assignmentIsDeleted,
          r.fullName as residentFullName, r.phone as residentPhone, r.email as residentEmail, r.username as residentUsername, r.status as residentStatus
        FROM Service_Resident sr
        JOIN Resident r ON sr.residentId = r.residentId
        WHERE sr.serviceId = ? 
          AND r.isDeleted = FALSE 
        ORDER BY sr.isDeleted ASC, sr.startDate DESC, sr.createdAt DESC
      `; // Show non-deleted assignments first
      const [rows] = await db.query(query, [serviceId]);
      return rows.map(row => ({
        serviceId: row.serviceId,
        residentId: row.residentId,
        startDate: row.startDate,
        endDate: row.endDate,
        rating: row.rating,
        assignmentCreatedAt: row.assignmentCreatedAt,
        assignmentUpdatedAt: row.assignmentUpdatedAt,
        assignmentIsDeleted: !!row.assignmentIsDeleted,
        resident: {
            residentId: row.residentId, // Add residentId here for convenience
            fullName: row.residentFullName,
            phone: row.residentPhone,
            email: row.residentEmail,
            username: row.residentUsername,
            status: !!row.residentStatus
        }
      }));
    } catch (error) {
      console.error(`Error fetching residents for service ${serviceId}:`, error);
      throw error;
    }
  },

  getSpecificAssignment: async (serviceId, residentId) => {
    // This can fetch both active or inactive (but not soft-deleted) based on how it's used.
    // Or make it specific to active: AND endDate IS NULL AND isDeleted = FALSE
    try {
      const [rows] = await db.query(
        'SELECT * FROM Service_Resident WHERE serviceId = ? AND residentId = ? AND isDeleted = FALSE', // Fetches the non-deleted record
        [serviceId, residentId]
      );
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching specific service assignment:', error);
      throw error;
    }
  }
};

module.exports = ServiceResident; 