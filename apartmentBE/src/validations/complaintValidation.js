const Joi = require('joi');

const complaintBaseSchema = {
  title: Joi.string()
    .min(5)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
      'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự',
      'any.required': 'Tiêu đề là bắt buộc'
    }),
  content: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Nội dung không được để trống',
      'string.min': 'Nội dung phải có ít nhất {#limit} ký tự',
      'string.max': 'Nội dung không được vượt quá {#limit} ký tự',
      'any.required': 'Nội dung là bắt buộc'
    })
};

const createComplaintSchema = Joi.object({
  ...complaintBaseSchema,
  residentId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID cư dân phải là số',
      'number.integer': 'ID cư dân phải là số nguyên',
      'number.positive': 'ID cư dân phải là số dương',
      'any.required': 'ID cư dân là bắt buộc'
    }),
  departmentId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.base': 'ID bộ phận phải là số',
      'number.integer': 'ID bộ phận phải là số nguyên',
      'number.positive': 'ID bộ phận phải là số dương'
    })
});

const updateComplaintSchema = Joi.object({
  ...complaintBaseSchema,
  status: Joi.string()
    .valid('Chờ xử lý', 'Đã tiếp nhận', 'Đang xử lý', 'Hoàn thành', 'Đã hủy')
    .messages({
      'string.empty': 'Trạng thái không được để trống',
      'any.only': 'Trạng thái không hợp lệ'
    }),
  departmentId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.base': 'ID bộ phận phải là số',
      'number.integer': 'ID bộ phận phải là số nguyên',
      'number.positive': 'ID bộ phận phải là số dương'
    })
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});

const assignDepartmentSchema = Joi.object({
  departmentId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID bộ phận phải là số',
      'number.integer': 'ID bộ phận phải là số nguyên',
      'number.positive': 'ID bộ phận phải là số dương',
      'any.required': 'ID bộ phận là bắt buộc'
    })
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Chờ xử lý', 'Đã tiếp nhận', 'Đang xử lý', 'Hoàn thành', 'Đã hủy')
    .required()
    .messages({
      'string.empty': 'Trạng thái không được để trống',
      'any.only': 'Trạng thái không hợp lệ',
      'any.required': 'Trạng thái là bắt buộc'
    })
});

module.exports = {
  createComplaintSchema,
  updateComplaintSchema,
  assignDepartmentSchema,
  updateStatusSchema
}; 