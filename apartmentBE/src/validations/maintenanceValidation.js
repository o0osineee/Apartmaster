const Joi = require('joi');

const createMaintenanceSchema = Joi.object({
  title: Joi.string().trim().max(100).required().messages({
    'string.base': 'Tiêu đề bảo trì phải là chuỗi.',
    'string.empty': 'Tiêu đề không được để trống.',
    'string.max': 'Tiêu đề không được vượt quá 100 ký tự.',
    'any.required': 'Tiêu đề là bắt buộc.'
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Mô tả phải là chuỗi.'
  }),
  time: Joi.date().iso().required().messages({
    'date.format': 'Thời gian phải theo định dạng ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ).',
    'any.required': 'Thời gian là bắt buộc.'
  }),
  status: Joi.string().trim().max(50).allow(null, '').optional().messages({
    'string.base': 'Trạng thái phải là chuỗi.',
    'string.max': 'Trạng thái không được vượt quá 50 ký tự.'
  }),

  employeeId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Nhân viên phải là số.',
    'any.required': 'ID Nhân viên là bắt buộc.'
  })
});

const updateMaintenanceSchema = Joi.object({
  title: Joi.string().trim().max(100).optional().messages({
    'string.base': 'Tiêu đề bảo trì phải là chuỗi.',
    'string.max': 'Tiêu đề không được vượt quá 100 ký tự.'
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Mô tả phải là chuỗi.'
  }),
  time: Joi.date().iso().optional().messages({
    'date.format': 'Thời gian phải theo định dạng ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ).'
  }),
  status: Joi.string().trim().max(50).allow(null, '').optional().messages({
    'string.base': 'Trạng thái phải là chuỗi.',
    'string.max': 'Trạng thái không được vượt quá 50 ký tự.'
  }),

  employeeId: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID Nhân viên phải là số.'
  })
}).min(1).messages({
    'object.min': 'Cần ít nhất một trường để cập nhật.'
});

module.exports = {
  createMaintenanceSchema,
  updateMaintenanceSchema
}; 