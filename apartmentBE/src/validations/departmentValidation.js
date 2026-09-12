const Joi = require('joi');

const departmentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Tên phòng ban phải là một chuỗi',
    'string.empty': 'Tên phòng ban không được để trống',
    'string.min': 'Tên phòng ban phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên phòng ban không được vượt quá {#limit} ký tự',
    'any.required': 'Tên phòng ban là trường bắt buộc'
  }),
  description: Joi.string().max(255).optional().allow('', null).messages({
    'string.base': 'Mô tả phải là một chuỗi',
    'string.max': 'Mô tả không được vượt quá {#limit} ký tự'
  })
});

module.exports = {
  departmentSchema
}; 