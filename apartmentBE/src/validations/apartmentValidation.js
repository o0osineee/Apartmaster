const Joi = require('joi');

const apartmentSchema = Joi.object({
  code: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Mã căn hộ là bắt buộc.',
    'string.min': 'Mã căn hộ phải có ít nhất {#limit} ký tự.'
  }),
  building: Joi.string().min(1).max(50).required().messages({
    'any.required': 'Tên tòa nhà là bắt buộc.'
  }),
  floor: Joi.number().integer().required().messages({
    'any.required': 'Số tầng là bắt buộc.',
    'number.base': 'Số tầng phải là số nguyên.'
  }),
  area: Joi.number().positive().optional().allow(null).messages({
    'number.base': 'Diện tích phải là số.',
    'number.positive': 'Diện tích phải là số dương.'
  }),
  status: Joi.string().max(50).optional().allow(null, '').messages({
    'string.max': 'Trạng thái không được vượt quá {#limit} ký tự.'
  }), // Ví dụ: 'Còn trống', 'Đã bán', 'Đang cho thuê'
  contract: Joi.string().optional().allow(null, '')
});

const updateApartmentSchema = apartmentSchema.min(1); // Ít nhất 1 trường khi cập nhật

module.exports = {
  apartmentSchema, // Dùng cho create
  updateApartmentSchema // Dùng cho update
}; 