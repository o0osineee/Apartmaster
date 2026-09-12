const Joi = require('joi');

const updateUserSchema = Joi.object({
  password: Joi.string().min(6).optional().allow(null, '').messages({
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự.'
  }),
  status: Joi.number().valid(0, 1).required().messages({
    'number.base': 'Trạng thái phải là số.',
    'any.only': 'Trạng thái phải là 0 hoặc 1.',
    'any.required': 'Trạng thái là bắt buộc.'
  })
}).min(1); // Ít nhất một trường phải được cung cấp để cập nhật

module.exports = {
  updateUserSchema
}; 