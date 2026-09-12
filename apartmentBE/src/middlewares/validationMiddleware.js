const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false, // Hiển thị tất cả các lỗi thay vì dừng ở lỗi đầu tiên
      allowUnknown: true // Bỏ qua các trường không được định nghĩa trong schema
    }); 

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors });
    }
    next(); // Nếu không có lỗi, chuyển sang handler tiếp theo
  };
};

module.exports = validateRequest; 