const Joi = require('joi');

const residentBaseSchema = {
  fullName: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Họ tên phải có ít nhất {#limit} ký tự.',
    'any.required': 'Họ tên là bắt buộc.'
  }),
  birthDate: Joi.date().iso().optional().allow(null, '').messages({
    'date.format': 'Ngày sinh phải theo định dạng YYYY-MM-DD.'
  }),
  gender: Joi.string().valid('Nam', 'Nữ', 'Khác').optional().allow(null, '').messages({
    'any.only': 'Giới tính phải là Nam, Nữ, hoặc Khác.'
  }),
  idNumber: Joi.string().pattern(/^[0-9]{12}$/).required().messages({
    'string.pattern.base': 'Số CMND/CCCD phải là 12 chữ số.',
    'any.required': 'Số CMND/CCCD là bắt buộc.'
  }),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).optional().allow(null, '').messages({
    'string.pattern.base': 'Số điện thoại phải từ 10 đến 11 chữ số.'
  }),
  email: Joi.string().email().optional().allow(null, '').messages({
    'string.email': 'Email không hợp lệ.'
  }),
  username: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Tên đăng nhập phải là chuỗi.'
  }),
  password: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Mật khẩu phải là chuỗi.'
  }),
  status: Joi.number().integer().optional(),
  roleId: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID Vai trò phải là số.',
  }),
  apartmentCode: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Mã căn hộ phải là chuỗi.'
  }),
  isOwner: Joi.boolean().optional().allow(null).messages({
    'boolean.base': 'Vai trò chủ hộ phải là true hoặc false.'
  })
};

const createResidentSchema = Joi.object({
  ...residentBaseSchema
}).options({ 
  stripUnknown: true,
  abortEarly: false // Return all validation errors
});

const updateResidentSchema = Joi.object({
  ...residentBaseSchema
}).min(1).options({ 
  stripUnknown: true,
  abortEarly: false // Return all validation errors
});

module.exports = {
  createResidentSchema,
  updateResidentSchema
}; 