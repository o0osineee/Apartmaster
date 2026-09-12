const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).required().messages({
    'string.base': 'Tiêu đề công việc phải là chuỗi.',
    'string.empty': 'Tiêu đề công việc không được để trống.',
    'string.max': 'Tiêu đề công việc không được vượt quá 255 ký tự.',
    'any.required': 'Tiêu đề công việc là bắt buộc.'
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Mô tả công việc phải là chuỗi.'
  }),
  deadline: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Hạn chót phải theo định dạng YYYY-MM-DD.'
  }),
  status: Joi.string().valid('Chờ xử lý', 'Đang xử lý', 'Hoàn thành').default('Chờ xử lý').messages({
    'string.base': 'Trạng thái công việc phải là chuỗi.',
    'any.only': 'Trạng thái không hợp lệ'
  }),
  departmentId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Phòng ban phải là số.',
    'number.integer': 'ID Phòng ban phải là số nguyên.',
    'number.positive': 'ID Phòng ban phải là số dương.',
    'any.required': 'ID Phòng ban là bắt buộc.'
  }),
  employeeId: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'ID Nhân viên phải là số.',
    'number.integer': 'ID Nhân viên phải là số nguyên.',
    'number.positive': 'ID Nhân viên phải là số dương.'
  })
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).optional().messages({
    'string.base': 'Tiêu đề công việc phải là chuỗi.',
    'string.max': 'Tiêu đề công việc không được vượt quá 255 ký tự.'
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Mô tả công việc phải là chuỗi.'
  }),
  deadline: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Hạn chót phải theo định dạng YYYY-MM-DD.'
  }),
  status: Joi.string().valid('Chờ xử lý', 'Đang xử lý', 'Hoàn thành').optional().messages({
    'string.base': 'Trạng thái công việc phải là chuỗi.',
    'any.only': 'Trạng thái không hợp lệ'
  }),
  departmentId: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID Phòng ban phải là số.',
    'number.integer': 'ID Phòng ban phải là số nguyên.',
    'number.positive': 'ID Phòng ban phải là số dương.'
  }),
  employeeId: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'ID Nhân viên phải là số.',
    'number.integer': 'ID Nhân viên phải là số nguyên.',
    'number.positive': 'ID Nhân viên phải là số dương.'
  })
}).min(1);

module.exports = {
  createTaskSchema,
  updateTaskSchema
}; 