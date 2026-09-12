const Joi = require('joi');

const calculateBillSchema = Joi.object({
  apartmentId: Joi.number().required().messages({
    'number.base': 'Mã căn hộ phải là số',
    'any.required': 'Vui lòng chọn căn hộ'
  }),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required().messages({
    'string.pattern.base': 'Tháng phải có định dạng YYYY-MM',
    'any.required': 'Vui lòng chọn tháng'
  })
});

const updateBillPaymentSchema = Joi.object({
  isPaid: Joi.boolean().required().messages({
    'boolean.base': 'Trạng thái thanh toán không hợp lệ',
    'any.required': 'Vui lòng chọn trạng thái thanh toán'
  }),
  paymentMethod: Joi.string().max(50).required().messages({
    'string.max': 'Phương thức thanh toán không được vượt quá 50 ký tự',
    'any.required': 'Vui lòng chọn phương thức thanh toán'
  })
});

module.exports = {
  calculateBillSchema,
  updateBillPaymentSchema
}; 