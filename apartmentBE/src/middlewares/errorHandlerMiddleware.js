// Middleware xử lý lỗi toàn cục
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err); // Log lỗi ra console để debug

  let statusCode = err.statusCode || 500; // Mặc định là 500 nếu không có statusCode cụ thể
  let message = err.message || 'Lỗi máy chủ nội bộ';
  let errors = err.errors || undefined; // Các lỗi chi tiết (ví dụ từ Joi)

  // Xử lý các loại lỗi cụ thể nếu cần
  if (err.name === 'UnauthorizedError') { // Ví dụ: lỗi từ express-jwt
    statusCode = 401;
    message = 'Token không hợp lệ hoặc đã hết hạn';
  }

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409; // Conflict
    // Cố gắng trích xuất trường bị trùng lặp từ thông báo lỗi của MySQL
    const match = err.sqlMessage ? err.sqlMessage.match(/Duplicate entry '(.*?)' for key '(.*?)'/) : null;
    if (match && match[2]) {
        const duplicatedField = match[2].split('.').pop(); // Lấy tên cột từ key_name
        message = `Giá trị cho trường '${duplicatedField}' đã tồn tại.`;
    } else {
        message = 'Một trường dữ liệu đã tồn tại.'; // Thông báo chung nếu không trích xuất được
    }
  }
  
  // TODO: Có thể thêm các xử lý lỗi khác ở đây cho các mã lỗi MySQL cụ thể,
  // ví dụ: ER_NO_REFERENCED_ROW_2 (lỗi khóa ngoại), ER_DATA_TOO_LONG, etc.

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors: errors }), // Chỉ thêm trường errors nếu nó tồn tại
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Chỉ hiển thị stack trace ở môi trường dev
  });
};

module.exports = errorHandler; 