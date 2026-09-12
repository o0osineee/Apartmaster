const Joi = require('joi');

const assignServiceSchema = Joi.object({
  serviceId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Dịch vụ phải là số.',
    'any.required': 'ID Dịch vụ là bắt buộc.'
  }),
  residentId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Cư dân phải là số.',
    'any.required': 'ID Cư dân là bắt buộc.'
  }),
  startDate: Joi.date().iso().optional().messages({
    'date.format': 'Ngày bắt đầu phải theo định dạng YYYY-MM-DD.'
  }),
  rating: Joi.number().integer().min(0).max(5).optional().allow(null).messages({
    'number.base': 'Đánh giá phải là số.',
    'number.min': 'Đánh giá không được nhỏ hơn 0.',
    'number.max': 'Đánh giá không được lớn hơn 5.'
  })
});

const updateServiceAssignmentSchema = Joi.object({
  startDate: Joi.date().iso().optional().messages({
    'date.format': 'Ngày bắt đầu phải theo định dạng YYYY-MM-DD.'
  }),
  endDate: Joi.date().iso().optional().allow(null)
    .when('startDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('startDate')),
      otherwise: Joi.optional()
    }).messages({
    'date.format': 'Ngày kết thúc phải theo định dạng YYYY-MM-DD.',
    'date.min': 'Ngày kết thúc không được trước ngày bắt đầu.'
  }),
  rating: Joi.number().integer().min(0).max(5).optional().allow(null).messages({
    'number.base': 'Đánh giá phải là số.',
    'number.min': 'Đánh giá không được nhỏ hơn 0.',
    'number.max': 'Đánh giá không được lớn hơn 5.'
  })
}).min(1).messages({
    'object.min': 'Cần ít nhất một trường để cập nhật.'
});

module.exports = {
  assignServiceSchema,
  updateServiceAssignmentSchema
}; 