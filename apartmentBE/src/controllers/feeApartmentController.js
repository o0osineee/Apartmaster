const FeeApartmentService = require('../services/feeApartmentService');

const FeeApartmentController = {
    getFeesByApartment: async (req, res) => {
        try {
            const { apartmentId } = req.params;
            
            if (!apartmentId || isNaN(parseInt(apartmentId))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID căn hộ không hợp lệ'
                });
            }

            const fees = await FeeApartmentService.getFeesByApartment(parseInt(apartmentId));
            
            return res.status(200).json({
                success: true,
                data: fees
            });
        } catch (error) {
            console.error('Error in getFeesByApartment:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin phí của căn hộ'
            });
        }
    }
};

module.exports = FeeApartmentController; 