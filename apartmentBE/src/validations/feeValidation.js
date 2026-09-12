const Joi = require('joi');

const feeBaseSchema = {
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tên phí không được để trống',
      'string.max': 'Tên phí không được vượt quá 100 ký tự',
      'any.required': 'Tên phí là bắt buộc'
    }),
  type: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Loại phí không được để trống',
      'string.max': 'Loại phí không được vượt quá 100 ký tự',
      'any.required': 'Loại phí là bắt buộc'
    }),
  price: Joi.number()
    .precision(2)
    .min(0)
    .required()
    .messages({
      'number.base': 'Giá phí phải là số',
      'number.min': 'Giá phí không được âm',
      'number.precision': 'Giá phí chỉ được có tối đa 2 chữ số thập phân',
      'any.required': 'Giá phí là bắt buộc'
    })
};

const createFeeSchema = Joi.object({
  ...feeBaseSchema
});

const updateFeeSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'Tên phí không được vượt quá 100 ký tự'
    }),
  type: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'Loại phí không được vượt quá 100 ký tự'
    }),
  price: Joi.number()
    .precision(2)
    .min(0)
    .allow('', null)
    .messages({
      'number.base': 'Giá phí phải là số',
      'number.min': 'Giá phí không được âm',
      'number.precision': 'Giá phí chỉ được có tối đa 2 chữ số thập phân'
    })
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});

module.exports = {
  createFeeSchema,
  updateFeeSchema
}; 