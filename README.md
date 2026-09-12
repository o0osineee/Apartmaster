# ApartMaster

Hệ thống quản lý chung cư — BTL Phân tích thiết kế các hệ thống thông tin.

- **Backend**: Node.js + Express + MySQL (`apartmentBE/`)
- **Frontend**: React + Vite + Material UI (`apartmentFE/`)

---

## Mục lục

1. [Cách 1 (khuyến nghị): Chạy toàn bộ bằng Docker](#cách-1-khuyến-nghị-chạy-toàn-bộ-bằng-docker)
2. [Cách 2: Chạy thủ công để code/dev](#cách-2-chạy-thủ-công-để-codedev)
3. [Tài khoản đăng nhập mẫu](#tài-khoản-đăng-nhập-mẫu)
4. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
5. [Chạy test](#chạy-test)
6. [Xử lý sự cố thường gặp](#xử-lý-sự-cố-thường-gặp)

---

## Cách 1 (khuyến nghị): Chạy toàn bộ bằng Docker

Dành cho người mới clone repo, chỉ muốn **chạy được website lên xem**, không cần cài Node.js hay MySQL — chỉ cần Docker.

### Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã cài và đang chạy (kiểm tra bằng `docker info`).

### Các bước

**Bước 1 — Clone repo**

```bash
git clone <đường-dẫn-repo-của-bạn>
cd apartmaster
```

**Bước 2 — Vào thư mục `deploy` và tạo file cấu hình**

```bash
cd deploy
cp .env.example .env
```

File `.env` đã có sẵn giá trị mặc định hợp lý (mật khẩu MySQL, JWT secret, các cổng) — với mục đích chạy thử/local thì **không cần sửa gì thêm**. Nếu máy bạn đang chiếm cổng `8080`/`3001`/`3306`/`8081`, mở file `.env` và đổi các biến `FE_PORT`/`BE_PORT`/`MYSQL_PORT`/`PHPMYADMIN_PORT`.

**Bước 3 — Build và khởi động toàn bộ hệ thống**

```bash
docker compose up -d --build
```

Lệnh này sẽ:
- Build image cho backend và frontend từ source code.
- Tải image MySQL 8.0, phpMyAdmin.
- Ở **lần chạy đầu tiên**, MySQL sẽ tự động import schema (`createdb.sql`), các migration, và dữ liệu mẫu (`sampledb.sql`) — kèm hash sẵn mật khẩu mẫu bằng bcrypt để có thể đăng nhập ngay, không cần chạy script gì thêm.

Lần đầu mất khoảng 1–3 phút tuỳ mạng và máy (tải image + build). Các lần `up` sau sẽ nhanh hơn nhiều vì Docker cache lại các bước không đổi.

**Bước 4 — Kiểm tra các container đã chạy chưa**

```bash
docker compose ps
```

Đợi tới khi cột `STATUS` của `mysql` và `backend` hiện `(healthy)`.

**Bước 5 — Mở website**

| Dịch vụ | URL mặc định | Ghi chú |
|---|---|---|
| **Frontend (web)** | http://localhost:8080 | Trang chính, mở link này để dùng web |
| Backend API | http://localhost:3001/api | Frontend cũng gọi qua `/api` trên chính port 8080 (nginx tự proxy) |
| phpMyAdmin | http://localhost:8081 | Xem/sửa dữ liệu trực tiếp — user `root`, mật khẩu lấy trong `deploy/.env` (`MYSQL_ROOT_PASSWORD`) |

Đăng nhập bằng một trong các [tài khoản mẫu](#tài-khoản-đăng-nhập-mẫu) bên dưới, mật khẩu đều là `password123`.

### Dừng / khởi động lại

```bash
docker compose stop          # dừng, giữ nguyên dữ liệu đã tạo
docker compose start         # chạy lại
docker compose down          # dừng và xoá container (dữ liệu MySQL vẫn còn trong volume)
docker compose down -v       # dừng và XOÁ LUÔN dữ liệu — lần "up" kế tiếp sẽ seed lại từ đầu
```

Sau khi sửa code và muốn cập nhật lại website đang chạy bằng Docker:

```bash
docker compose up -d --build
```

Xem thêm chi tiết/troubleshooting riêng cho phần Docker tại [`deploy/README.md`](deploy/README.md).

---

## Cách 2: Chạy thủ công để code/dev

Dành cho việc **phát triển** (sửa code Backend/Frontend và thấy thay đổi ngay — hot reload), thay vì build lại image Docker mỗi lần sửa.

### Yêu cầu

- [Node.js](https://nodejs.org/) phiên bản 18 trở lên (khuyến nghị 20).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — chỉ dùng để chạy MySQL, không bắt buộc phải cài MySQL lên máy thật.
- `npm` (đi kèm Node.js) và `yarn` (`npm install -g yarn` nếu chưa có, vì frontend dùng yarn).

### Bước 1 — Clone repo

```bash
git clone <đường-dẫn-repo-của-bạn>
cd apartmaster
```

### Bước 2 — Chạy MySQL bằng Docker

```bash
cd infra
cp .env.dev.example .env.dev
cd database
docker compose -f mysql-compose.yaml up -d
```

Giống Cách 1, ở lần chạy đầu tiên MySQL sẽ tự seed schema + dữ liệu mẫu (mật khẩu đã hash sẵn). Kiểm tra bằng:

```bash
docker compose -f mysql-compose.yaml ps   # đợi mysql hiện "(healthy)"
```

MySQL chạy ở `localhost:3306`, phpMyAdmin ở `localhost:8082` (user `root`, mật khẩu trong `infra/.env.dev`).

> ⚠️ Cách 1 và Cách 2 cùng dùng cổng `3306` cho MySQL — **không chạy cả hai cùng lúc**. Nếu đang chạy Cách 1, hãy `docker compose down` (trong `deploy/`) trước khi làm bước này.

### Bước 3 — Chạy Backend

Mở terminal mới:

```bash
cd apartmentBE
cp .env.example .env
npm install
npm run dev
```

`npm run dev` dùng `nodemon` nên sửa code là tự restart server. Backend chạy ở **http://localhost:3001**. Console sẽ báo `Server is running on port 3001`.

### Bước 4 — Chạy Frontend

Mở thêm một terminal khác (giữ backend đang chạy):

```bash
cd apartmentFE
yarn install
yarn dev
```

Vite sẽ in ra URL, mặc định **http://localhost:5173**. Mở link đó lên trình duyệt. Vite dev server tự động proxy các request `/api/...` sang `http://localhost:3001` (cấu hình sẵn trong `apartmentFE/vite.config.js`), nên không cần cấu hình thêm gì.

Sửa code frontend/backend sẽ tự hot-reload — không cần restart thủ công.

### Tắt hết khi làm xong

```bash
# Ctrl+C ở 2 terminal chạy backend/frontend
cd infra/database && docker compose -f mysql-compose.yaml stop
```

---

## Tài khoản đăng nhập mẫu

Dữ liệu mẫu (`sampledb.sql`) đã tạo sẵn các tài khoản sau, **mật khẩu đều là `password123`**:

| Username | Vai trò |
|---|---|
| `employee1` | Trưởng ban quản lý |
| `employee2` | Phó ban quản lý |
| `employee3` | Tổ trưởng |
| `employee4` | Tổ phó |
| `employee5` | Nhân viên |
| `resident1` – `resident5` | Cư dân |

---

## Cấu trúc thư mục

```
apartmaster/
├── apartmentBE/          # Backend — Express + MySQL
│   ├── src/               # Source code (routes, controllers, services, models...)
│   ├── database/          # Schema (createdb.sql), migrations/, dữ liệu mẫu (sampledb.sql)
│   ├── tests/              # Jest test
│   └── Dockerfile
├── apartmentFE/           # Frontend — React + Vite
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf          # Cấu hình nginx dùng khi build production (proxy /api)
├── infra/                 # MySQL cho môi trường dev thủ công (Cách 2)
│   └── database/mysql-compose.yaml
├── deploy/                 # Chạy toàn bộ website bằng Docker (Cách 1)
│   ├── docker-compose.yaml
│   ├── mysql-init/          # Script/SQL tự seed database khi container khởi tạo lần đầu
│   └── README.md
└── bug.md                  # Báo cáo kiểm thử + changelog sửa lỗi
```

---

## Chạy test

Backend có bộ test Jest (unit test cho service layer và middleware xử lý lỗi):

```bash
cd apartmentBE
npm test
```

Frontend có thể kiểm tra lint và build production:

```bash
cd apartmentFE
yarn lint
yarn build
```

---

## Xử lý sự cố thường gặp

**"port is already allocated" khi chạy `docker compose up`**
Có service khác (hoặc chính Cách 1/Cách 2 kia) đang chiếm cổng. Kiểm tra bằng `docker ps`, dừng container đang chiếm cổng, hoặc đổi cổng trong file `.env` tương ứng.

**Đăng nhập báo sai mật khẩu / tài khoản không tồn tại**
Khả năng cao volume MySQL đã tồn tại từ trước (không phải lần khởi tạo đầu tiên) nên bước tự seed không chạy lại. Xoá volume và tạo lại:
```bash
docker compose down -v   # trong deploy/ hoặc infra/database/, tuỳ cách bạn dùng
docker compose up -d
```

**Sửa code backend/frontend nhưng chạy bằng Docker (Cách 1) không thấy thay đổi**
Docker dùng image đã build sẵn, không tự nhận code mới. Chạy lại `docker compose up -d --build`. Nếu đang phát triển/sửa code thường xuyên, dùng **Cách 2** (chạy thủ công) sẽ tiện hơn nhiều vì có hot reload.

**MySQL container cứ khởi động rồi tắt (unhealthy)**
Kiểm tra log: `docker logs mysql` (Cách 2) hoặc `docker compose logs mysql` (trong `deploy/`, Cách 1). Thường do dữ liệu volume cũ không tương thích — thử `docker compose down -v` rồi `up -d` lại.
