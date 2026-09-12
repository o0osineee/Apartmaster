require('dotenv').config(); // Đảm bảo biến môi trường được tải sớm
const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // Import kết nối database
const mainRouter = require('./routes/index'); // Import router chính
const morgan = require('morgan'); // Import morgan
const authRoutes = require('./routes/authRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const feeApartmentRoutes = require('./routes/feeApartmentRoutes');
const errorHandler = require('./middlewares/errorHandlerMiddleware');

const app = express();
const PORT = process.env.PORT || 3001; // Sử dụng PORT từ .env hoặc mặc định 3001

// Middlewares cơ bản
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// HTTP request logger middleware (morgan)
// if (process.env.NODE_ENV === 'development') { // Chỉ dùng 'dev' format khi ở môi trường development
//   app.use(morgan('dev')); 
// } else {
//   app.use(morgan('combined')); // Dùng format chi tiết hơn cho production
// }

// API Routes
app.use('/api', mainRouter);
app.use('/api/auth', authRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/fee-apartments', feeApartmentRoutes);

// Route kiểm tra đơn giản
app.get('/', (req, res) => {
  res.send('Apartment Management API is running!');
});

// Route kiểm tra kết nối database
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful!', result: rows[0].solution });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Middleware xử lý lỗi toàn cục — phải đặt sau tất cả routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Xuất app để có thể dùng cho testing hoặc các mục đích khác
