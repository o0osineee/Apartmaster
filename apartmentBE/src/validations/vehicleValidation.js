const Joi = require('joi');

const createVehicleSchema = Joi.object({
  licensePlate: Joi.string().trim().max(50).required().messages({
    'string.base': 'Biển số xe phải là chuỗi.',
    'string.empty': 'Biển số xe không được để trống.',
    'string.max': 'Biển số xe không được vượt quá 50 ký tự.',
    'any.required': 'Biển số xe là bắt buộc.'
  }),
  type: Joi.string().trim().max(50).allow(null, '').optional().messages({
    'string.base': 'Loại xe phải là chuỗi.',
    'string.max': 'Loại xe không được vượt quá 50 ký tự.'
  }),
  residentId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Cư dân phải là số.',
    'number.integer': 'ID Cư dân phải là số nguyên.',
    'number.positive': 'ID Cư dân phải là số dương.',
    'any.required': 'ID Cư dân là bắt buộc.'
  })
});

const updateVehicleSchema = Joi.object({
  licensePlate: Joi.string().trim().max(50).optional().messages({
    'string.base': 'Biển số xe phải là chuỗi.',
    'string.max': 'Biển số xe không được vượt quá 50 ký tự.'
  }),
  type: Joi.string().trim().max(50).allow(null, '').optional().messages({
    'string.base': 'Loại xe phải là chuỗi.',
    'string.max': 'Loại xe không được vượt quá 50 ký tự.'
  }),
  residentId: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID Cư dân phải là số.',
    'number.integer': 'ID Cư dân phải là số nguyên.',
    'number.positive': 'ID Cư dân phải là số dương.'
  })
}).min(1); // At least one field to update

module.exports = {
  createVehicleSchema,
  updateVehicleSchema
}; 