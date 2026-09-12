const Joi = require('joi');

const assignSchema = Joi.object({
  residentId: Joi.number().integer().positive().required().messages({
    'any.required': 'ID Cư dân là bắt buộc.'
  }),
  apartmentId: Joi.number().integer().positive().required().messages({
    'any.required': 'ID Căn hộ là bắt buộc.'
  }),
  isOwner: Joi.boolean().required().messages({
    'any.required': 'Trạng thái sở hữu (isOwner) là bắt buộc.'
  }),
  moveInDate: Joi.date().iso().required().messages({
    'any.required': 'Ngày chuyển vào là bắt buộc.',
    'date.format': 'Ngày chuyển vào phải theo định dạng YYYY-MM-DD.'
  })
});

const updateAssignmentSchema = Joi.object({
  isOwner: Joi.boolean().required().messages({
    'any.required': 'Trạng thái sở hữu (isOwner) là bắt buộc.',
    'boolean.base': 'Vai trò chủ hộ phải là true hoặc false.'
  }),
  moveInDate: Joi.date().iso().optional().messages({
    'date.format': 'Ngày chuyển vào phải theo định dạng YYYY-MM-DD.'
  }),
  moveOutDate: Joi.date().iso().optional().allow(null).min(Joi.ref('moveInDate')).messages({
    'date.format': 'Ngày chuyển ra phải theo định dạng YYYY-MM-DD.',
    'date.min': 'Ngày chuyển ra không được trước ngày chuyển vào.'
  })
}).min(1); // Phải có ít nhất một trường để cập nhật

const setMoveOutDateSchema = Joi.object({
    moveOutDate: Joi.date().iso().required().messages({
        'any.required': 'Ngày chuyển ra là bắt buộc.',
        'date.format': 'Ngày chuyển ra phải theo định dạng YYYY-MM-DD.'
    })
});

module.exports = {
  assignSchema,
  updateAssignmentSchema,
  setMoveOutDateSchema
}; 