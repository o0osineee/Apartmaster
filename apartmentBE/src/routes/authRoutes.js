const express = require('express');
const AuthController = require('../controllers/authController');
const validateRequest = require('../middlewares/validationMiddleware');
const { updateUserSchema } = require('../validations/authValidation');

const router = express.Router();

// Route mặc định cho /api/auth
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is running',
    endpoints: {
      login: '/api/auth/login',
      loginInfo: '/api/auth/login-info',
      updateUser: '/api/auth/users/:id/update'
    }
  });
});

// Route đăng nhập
router.post('/login', AuthController.login);

// Lấy danh sách thông tin đăng nhập
router.get('/login-info', AuthController.getLoginInfo);

// Cập nhật mật khẩu và trạng thái người dùng
router.put('/users/:id/update', validateRequest(updateUserSchema), AuthController.updateUser);

module.exports = router; 