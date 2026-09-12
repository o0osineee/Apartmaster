const Joi = require('joi');

const rdpSchema = Joi.object({
  roleId: Joi.number().integer().positive().required().messages({
    'any.required': 'ID Vai trò là bắt buộc.',
    'number.base': 'ID Vai trò phải là số.'
  }),
  departmentId: Joi.number().integer().positive().required().messages({
    'any.required': 'ID Phòng ban là bắt buộc.',
    'number.base': 'ID Phòng ban phải là số.'
  }),
  permissionId: Joi.number().integer().positive().required().messages({
    'any.required': 'ID Quyền là bắt buộc.',
    'number.base': 'ID Quyền phải là số.'
  })
});

module.exports = {
  rdpSchema
}; 