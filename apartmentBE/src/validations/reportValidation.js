const Joi = require('joi');

const createReportSchema = Joi.object({
  employeeId: Joi.number().required().messages({
    'number.base': 'ID nhân viên không hợp lệ',
    'any.required': 'Vui lòng chọn người tạo báo cáo'
  }),
  note: Joi.string().allow('').optional().messages({
    'string.base': 'Ghi chú phải là chuỗi ký tự'
  })
});

const updateReportSchema = Joi.object({
  employeeId: Joi.number().required().messages({
    'number.base': 'ID nhân viên không hợp lệ',
    'any.required': 'Vui lòng chọn người tạo báo cáo'
  }),
  note: Joi.string().allow('').optional().messages({
    'string.base': 'Ghi chú phải là chuỗi ký tự'
  })
});

module.exports = {
  createReportSchema,
  updateReportSchema
}; 