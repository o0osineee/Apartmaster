# Chạy ApartMaster bằng Docker

Dành cho người mới clone repo — chỉ cần Docker, không cần cài Node/MySQL cục bộ.

```bash
cd deploy
cp .env.example .env   # đã có sẵn giá trị mặc định, chỉnh nếu cần
docker compose up -d --build
```

Lần đầu chạy sẽ mất khoảng 1-2 phút để build image và MySQL tự import schema +
dữ liệu mẫu (chỉ chạy một lần, vì `docker-entrypoint-initdb.d` chỉ kích hoạt
khi volume database còn trống).

Khi các container đã `healthy` (`docker compose ps`):

| Dịch vụ | URL | Ghi chú |
|---|---|---|
| Frontend | http://localhost:8080 | React app, đã build production |
| Backend API | http://localhost:3001/api | Cũng được truy cập qua `/api` trên frontend (nginx reverse-proxy) |
| phpMyAdmin | http://localhost:8081 | User `root`, mật khẩu trong `.env` |
| MySQL | localhost:3306 | Nếu muốn kết nối bằng client ngoài |

## Đăng nhập thử

Dữ liệu mẫu có sẵn tài khoản, mật khẩu đều là `password123`:

| username | vai trò |
|---|---|
| `employee1` | Trưởng ban quản lý |
| `employee2`–`employee5` | các vai trò nhân viên khác |
| `resident1`–`resident5` | Cư dân |

(Mật khẩu trong DB đã được hash sẵn bằng bcrypt khi seed — không cần chạy
script hash thủ công như lúc dev local.)

## Các lệnh hay dùng

```bash
docker compose logs -f backend      # xem log backend
docker compose down                 # dừng, giữ nguyên dữ liệu
docker compose down -v              # dừng và XÓA LUÔN dữ liệu (reseed lại từ đầu ở lần up kế tiếp)
docker compose up -d --build backend  # build lại riêng 1 service sau khi sửa code
```

## Ghi chú

- `deploy/.env` bị gitignore — không commit mật khẩu thật lên đây nếu deploy production thật.
- Đổi cổng trong `.env` (`FE_PORT`, `BE_PORT`, `MYSQL_PORT`, `PHPMYADMIN_PORT`) nếu máy bạn đang chiếm các cổng 8080/3001/3306/8081.
- Compose này build image trực tiếp từ `../apartmentBE` và `../apartmentFE` — chạy `docker compose up -d --build` sau khi pull code mới để cập nhật image.
