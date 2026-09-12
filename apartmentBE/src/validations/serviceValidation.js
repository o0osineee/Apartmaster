const Joi = require('joi');

const createServiceSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({
    'string.base': 'Tên dịch vụ phải là chuỗi.',
    'string.empty': 'Tên dịch vụ không được để trống.',
    'string.max': 'Tên dịch vụ không được vượt quá 255 ký tự.',
    'any.required': 'Tên dịch vụ là bắt buộc.'
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Mô tả dịch vụ phải là chuỗi.'
  }),
  feeId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Loại phí phải là số.',
    'number.integer': 'ID Loại phí phải là số nguyên.',
    'number.positive': 'ID Loại phí phải là số dương.',
    'any.required': 'ID Loại phí là bắt buộc.'
  })
});

const updateServiceSchema = Joi.object({
  name: Joi.string().trim().max(255).optional().messages({
    'string.base': 'Tên dịch vụ phải là chuỗi.',
    'string.max': 'Tên dịch vụ không được vượt quá 255 ký tự.'
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Mô tả dịch vụ phải là chuỗi.'
  }),
  feeId: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID Loại phí phải là số.',
    'number.integer': 'ID Loại phí phải là số nguyên.',
    'number.positive': 'ID Loại phí phải là số dương.'
  })
}).min(1); // At least one field to update

module.exports = {
  createServiceSchema,
  updateServiceSchema
}; 