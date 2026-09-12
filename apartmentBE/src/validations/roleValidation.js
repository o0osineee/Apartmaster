const Joi = require('joi');

const roleSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Tên vai trò phải là một chuỗi',
    'string.empty': 'Tên vai trò không được để trống',
    'string.min': 'Tên vai trò phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên vai trò không được vượt quá {#limit} ký tự',
    'any.required': 'Tên vai trò là trường bắt buộc'
  }),
  description: Joi.string().max(255).optional().allow('', null).messages({
    'string.base': 'Mô tả phải là một chuỗi',
    'string.max': 'Mô tả không được vượt quá {#limit} ký tự'
  })
});

module.exports = {
  roleSchema
}; 