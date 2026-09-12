const Joi = require('joi');

const employeeBaseSchema = {
  idNumber: Joi.string().pattern(/^[0-9]{12}$/).required().messages({
    'string.pattern.base': 'Số CMND/CCCD phải là 12 chữ số.',
    'any.required': 'Số CMND/CCCD là bắt buộc.'
  }),
  fullName: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Họ tên phải có ít nhất {#limit} ký tự.',
    'any.required': 'Họ tên là bắt buộc.'
  }),
  gender: Joi.string().valid('Nam', 'Nữ', 'Khác').optional().allow(null, ''),
  birthDate: Joi.date().iso().optional().allow(null, '').messages({
    'date.format': 'Ngày sinh phải theo định dạng YYYY-MM-DD.'
  }),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).optional().allow(null, '').messages({
    'string.pattern.base': 'Số điện thoại phải từ 10 đến 11 chữ số.'
  }),
  email: Joi.string().email().optional().allow(null, '').messages({
    'string.email': 'Email không hợp lệ.'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.format': 'Ngày bắt đầu làm việc phải theo định dạng YYYY-MM-DD.',
    'any.required': 'Ngày bắt đầu làm việc là bắt buộc.'
  }),
  endDate: Joi.date().iso().optional().allow(null, '').min(Joi.ref('startDate')).messages({
    'date.format': 'Ngày kết thúc làm việc phải theo định dạng YYYY-MM-DD.',
    'date.min': 'Ngày kết thúc không được trước ngày bắt đầu.'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Tên đăng nhập chỉ được chứa chữ và số.',
    'string.min': 'Tên đăng nhập phải có ít nhất {#limit} ký tự.',
    'any.required': 'Tên đăng nhập là bắt buộc.'
  }),
  status: Joi.number().integer().valid(0, 1).optional().messages({
    'number.base': 'Trạng thái phải là số.',
    'any.only': 'Trạng thái phải là 0 hoặc 1.'
  }),
  roleId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Vai trò phải là số.',
    'number.positive': 'ID Vai trò phải là số dương.',
    'any.required': 'Vai trò là bắt buộc.'
  }),
  departmentId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID Phòng ban phải là số.',
    'number.positive': 'ID Phòng ban phải là số dương.',
    'any.required': 'Phòng ban là bắt buộc.'
  })
};

const createEmployeeSchema = Joi.object({
  ...employeeBaseSchema,
  password: Joi.string().min(6).required().messages({ // Nhớ rằng đây là mật khẩu chưa hash
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự.',
    'any.required': 'Mật khẩu là bắt buộc.'
  })
});

const updateEmployeeSchema = Joi.object({
  ...employeeBaseSchema,
  // Mật khẩu là tùy chọn khi cập nhật, và nếu có nên có endpoint riêng để thay đổi mật khẩu
  password: Joi.string().min(6).optional().allow(null, '').messages({
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự.'
  })
}).min(1); // Ít nhất một trường phải được cung cấp để cập nhật

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema
}; 