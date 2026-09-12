const db = require('../config/database');

const FeeApartmentService = {
    getFeesByApartment: async (apartmentId) => {
        try {
            const [fees] = await db.query(`
                SELECT 
                    af.apartmentId,
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

            return fees;
        } catch (error) {
            console.error('Error in getFeesByApartment service:', error);
            throw error;
        }
    }
};

module.exports = FeeApartmentService; 