const Joi = require('joi');

const permissionSchema = Joi.object({
  name: Joi.string().min(3).max(100).uppercase().replace(/\s+/g, '_').required().messages({
    'string.base': 'Tên quyền phải là một chuỗi',
    'string.empty': 'Tên quyền không được để trống',
    'string.min': 'Tên quyền phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên quyền không được vượt quá {#limit} ký tự',
    'any.required': 'Tên quyền là trường bắt buộc'
  }),
  description: Joi.string().max(255).optional().allow('', null).messages({
    'string.base': 'Mô tả phải là một chuỗi',
    'string.max': 'Mô tả không được vượt quá {#limit} ký tự'
  })
});

module.exports = {
  permissionSchema
}; 