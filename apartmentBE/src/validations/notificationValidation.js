const Joi = require('joi');

const notificationBaseSchema = Joi.object({
  title: Joi.string().min(5).max(100).required()
    .messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
      'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự',
      'any.required': 'Tiêu đề là bắt buộc'
    }),
  content: Joi.string().max(1000)
    .messages({
      'string.max': 'Nội dung không được vượt quá {#limit} ký tự'
    }),
  status: Joi.string().valid('Ẩn', 'Hiển thị').default('Hiển thị')
    .messages({
      'string.empty': 'Trạng thái không được để trống',
      'any.only': 'Trạng thái không hợp lệ'
    })
});

const createNotificationSchema = notificationBaseSchema.keys({
  employeeId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'ID nhân viên phải là số',
      'number.integer': 'ID nhân viên phải là số nguyên',
      'number.positive': 'ID nhân viên phải là số dương'
    })
});

const updateNotificationSchema = Joi.object({
  title: Joi.string().min(5).max(100).allow('', null)
    .messages({
      'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
      'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự'
    }),
  content: Joi.string().max(1000).allow('', null)
    .messages({
      'string.max': 'Nội dung không được vượt quá {#limit} ký tự'
    }),
  status: Joi.string().valid('Ẩn', 'Hiển thị').allow('', null)
    .messages({
      'any.only': 'Trạng thái không hợp lệ'
    })
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Ẩn', 'Hiển thị').required()
    .messages({
      'string.empty': 'Trạng thái không được để trống',
      'any.only': 'Trạng thái không hợp lệ',
      'any.required': 'Trạng thái là bắt buộc'
    })
});

module.exports = {
  createNotificationSchema,
  updateNotificationSchema,
  updateStatusSchema
}; 