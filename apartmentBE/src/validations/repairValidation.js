const Joi = require('joi');

const repairBaseSchema = {
  title: Joi.string().min(3).max(100).required()
    .messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
      'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự',
      'any.required': 'Tiêu đề là bắt buộc'
    }),
  description: Joi.string().min(10).max(500).required()
    .messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất {#limit} ký tự',
      'string.max': 'Mô tả không được vượt quá {#limit} ký tự',
      'any.required': 'Mô tả là bắt buộc'
    })
};

const createRepairSchema = Joi.object({
  ...repairBaseSchema,
  residentId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID cư dân phải là số',
      'number.integer': 'ID cư dân phải là số nguyên',
      'number.positive': 'ID cư dân phải là số dương',
      'any.required': 'ID cư dân là bắt buộc'
    })
});

const updateRepairSchema = Joi.object({
  ...repairBaseSchema,
  status: Joi.string().valid('Đã tiếp nhận', 'Đang xử lý', 'Hoàn thành')
    .messages({
      'string.empty': 'Trạng thái không được để trống',
      'any.only': 'Trạng thái không hợp lệ'
    }),
  employeeId: Joi.number().integer().positive()
    .messages({
      'number.base': 'ID nhân viên phải là số',
      'number.integer': 'ID nhân viên phải là số nguyên',
      'number.positive': 'ID nhân viên phải là số dương'
    })
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});

const assignEmployeeSchema = Joi.object({
  employeeId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID nhân viên phải là số',
      'number.integer': 'ID nhân viên phải là số nguyên',
      'number.positive': 'ID nhân viên phải là số dương',
      'any.required': 'ID nhân viên là bắt buộc'
    })
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Đã tiếp nhận', 'Đang xử lý', 'Hoàn thành').required()
    .messages({
      'string.empty': 'Trạng thái không được để trống',
      'any.only': 'Trạng thái không hợp lệ',
      'any.required': 'Trạng thái là bắt buộc'
    })
});

module.exports = {
  createRepairSchema,
  updateRepairSchema,
  assignEmployeeSchema,
  updateStatusSchema
}; 