INSERT INTO Role (name, description) VALUES
                                         ('Trưởng ban quản lý', 'Trưởng ban quản lý'),
                                         ('Phó ban quản lý', 'Phó ban quản lý'),
                                         ('Tổ trưởng', 'Tổ trưởng'),
                                         ('Tổ phó', 'Tổ phó'),
                                         ('Nhân viên', 'Nhân viên'),
                                         ('Cư dân', 'Cư dân');
INSERT INTO Permission (name, description) VALUES
                                                           ('Quản lý người dùng', 'Quản lý người dùng'),
                                                           ('Quản lý cư dân', 'Quản lý cư dân'),
                                                           ('Quản lý căn hộ', 'Quản lý căn hộ'),
                                                           ('Quản lý dịch vụ', 'Quản lý dịch vụ'),
                                                           ('Quản lý phương tiện', 'Quản lý phương tiện'),
                                                           ('Quản lý công việc', 'Quản lý công việc'),
                                                           ('Quản lý nhân viên', 'Quản lý nhân viên'),
                                                           ('Quản lý bảo trì', 'Quản lý bảo trì'),
                                                           ('Quản lý sửa chữa', 'Quản lý sửa chữa'),
                                                           ('Quản lý phản ánh', 'Quản lý phản ánh'),
                                                           ('Quản lý phí', 'Quản lý phí'),
                                                           ('Quản lý hoá đơn', 'Quản lý hoá đơn'),
                                                           ('Quản lý thông báo', 'Quản lý thông báo cư dân'),
                                                           ('Báo cáo và thống kê', 'Báo cáo thống kê');

INSERT INTO Department (name, description)
VALUES
    ('Lãnh đạo ban quản lý', 'Lãnh đạo ban quản lý'),
    ('Bộ phận kỹ thuật', 'Phụ trách các vấn đề kỹ thuật của tòa nhà'),
    ('Bộ phận IT', 'Quản lý hệ thống công nghệ thông tin'),
    ('Bộ phận hành chính', 'Xử lý công việc hành chính và nhân sự'),
    ('Bộ phận tài chính', 'Quản lý tài chính và kế toán'),
    ('Bộ phận an ninh', 'Đảm bảo an ninh cho toàn bộ khu vực'),
    ('Bộ phận vệ sinh', 'Chịu trách nhiệm dọn dẹp và vệ sinh khu vực'),
    ('Bộ phận chăm sóc khách hàng', 'Giải đáp và xử lý yêu cầu từ cư dân');

INSERT INTO Role_Department_Permission(roleID, departmentID, permissionID) VALUES
                                                                    (1,1,1),
                                                                    (1,1,2),
                                                                    (1,1,3),
                                                                    (1,1,4),
                                                                    (1,1,5),
                                                                    (1,1,6),
                                                                    (1,1,7),
                                                                    (1,1,8),
                                                                    (1,1,9),
                                                                    (1,1,10),
                                                                    (1,1,11),
                                                                    (1,1,12),
                                                                    (1,1,13),
                                                                    (1,1,14);
INSERT INTO Role_Department_Permission(roleID, departmentID, permissionID) VALUES
                                                                     (2,1,1),
                                                                     (2,1,2),
                                                                     (2,1,3),
                                                                     (2,1,4),
                                                                     (2,1,5),
                                                                     (2,1,6),
                                                                     (2,1,7),
                                                                     (2,1,8),
                                                                     (2,1,9),
                                                                     (2,1,10),
                                                                     (2,1,11),
                                                                    (2,1,12),
                                                                    (2,1,13),
                                                                    (2,1,14);

INSERT INTO Employee (idNumber, fullName, gender, birthDate, phone, email, startDate, username, password, roleId, departmentId) VALUES
                                                                                                                                    ('012345678901', 'Nguyễn Văn An', 'Nam', '1985-05-10', '0912345678', 'nguyenvana@example.com', '2020-01-01', 'employee1', 'password123', 1, 1),
                                                                                                                                    ('012345678902', 'Trần Thị Bình', 'Nữ', '1990-08-15', '0918765432', 'tranthib@example.com', '2021-03-15', 'employee2', 'password123', 2, 2),
                                                                                                                                    ('012345678903', 'Lê Văn Cường', 'Nam', '1995-12-20', '0912233445', 'levanc@example.com', '2022-06-01', 'employee3', 'password123', 3, 3),
                                                                                                                                    ('012345678904', 'Phạm Văn Dũng', 'Nam', '1987-03-22', '0913456789', 'phamvand@example.com', '2019-05-10', 'employee4', 'password123', 4, 3),
                                                                                                                                    ('012345678905', 'Nguyễn Thị Em', 'Nữ', '1992-11-05', '0919876543', 'nguyenthie@example.com', '2021-07-01', 'employee5', 'password123', 5, 4),
                                                                                                                                    ('012345678906', 'Trần Văn Phúc', 'Nam', '1989-01-15', '0915566778', 'tranvanf@example.com', '2020-09-20', 'employee6', 'password123', 2, 5),
                                                                                                                                    ('012345678907', 'Lê Thị Giang', 'Nữ', '1993-06-30', '0916677889', 'lethig@example.com', '2022-02-10', 'employee7', 'password123', 3, 6),
                                                                                                                                    ('012345678908', 'Hoàng Văn Hùng', 'Nam', '1985-12-10', '0917788990', 'hoangvanh@example.com', '2018-03-25', 'employee8', 'password123', 1, 7),
                                                                                                                                    ('012345678909', 'Vũ Thị Hạnh', 'Nữ', '1990-04-18', '0918899001', 'vuthii@example.com', '2023-01-15', 'employee9', 'password123', 4, 8),
                                                                                                                                    ('012345678910', 'Đỗ Văn Nhật', 'Nam', '1994-09-12', '0919900112', 'dovanj@example.com', '2021-11-05', 'employee10', 'password123', 5, 2),
                                                                                                                                    ('012345678911', 'Bùi Thị Khánh', 'Nữ', '1988-07-19', '0911011123', 'buithik@example.com', '2020-06-15', 'employee11', 'password123', 3, 4),
                                                                                                                                    ('012345678912', 'Nguyễn Văn Lâm', 'Nam', '1991-02-25', '0912122234', 'nguyenvanl@example.com', '2022-08-01', 'employee12', 'password123', 2, 6),
                                                                                                                                    ('012345678913', 'Trần Thị Minh', 'Nữ', '1996-10-10', '0913233345', 'tranthim@example.com', '2023-03-20', 'employee13', 'password123', 5, 7);

INSERT INTO Resident (fullName, birthDate, gender, idNumber, phone, email, username, password, roleId) VALUES
                                                                                                           ('Phạm Thị Dung', '1988-07-25', 'Nữ', '012345678901', '0987654321', 'phamthid@example.com', 'resident1', 'password123', 6),
                                                                                                           ('Hoàng Văn Em', '1992-03-10', 'Nam', '012345678902', '0981234567', 'hoangvane@example.com', 'resident2', 'password123', 6),
                                                                                                           ('Nguyễn Văn Phúc', '1990-05-15', 'Nam', '012345678903', '0981112233', 'nguyenvanf@example.com', 'resident3', 'password123', 6),
                                                                                                           ('Trần Thị Giang', '1985-12-20', 'Nữ', '012345678904', '0982223344', 'tranthig@example.com', 'resident4', 'password123', 6),
                                                                                                           ('Lê Văn Hùng', '1993-07-10', 'Nam', '012345678905', '0983334455', 'levanh@example.com', 'resident5', 'password123', 6),
                                                                                                           ('Phạm Thị Hạnh', '1988-09-25', 'Nữ', '012345678906', '0984445566', 'phamthii@example.com', 'resident6', 'password123', 6),
                                                                                                           ('Hoàng Văn Nhật', '1995-03-30', 'Nam', '012345678907', '0985556677', 'hoangvanj@example.com', 'resident7', 'password123', 6),
                                                                                                           ('Vũ Thị Khánh', '1992-11-15', 'Nữ', '012345678908', '0986667788', 'vuthik@example.com', 'resident8', 'password123', 6),
                                                                                                           ('Đỗ Văn Lâm', '1987-04-05', 'Nam', '012345678909', '0987778899', 'dovanl@example.com', 'resident9', 'password123', 6),
                                                                                                           ('Bùi Thị Mai', '1991-08-18', 'Nữ', '012345678910', '0988889900', 'buithim@example.com', 'resident10', 'password123', 6),
                                                                                                           ('Nguyễn Văn Nam', '1994-01-22', 'Nam', '012345678911', '0989990011', 'nguyenvann@example.com', 'resident11', 'password123', 6),
                                                                                                           ('Trần Thị Oanh', '1989-06-12', 'Nữ', '012345678912', '0980001122', 'tranthio@example.com', 'resident12', 'password123', 6);

INSERT INTO Apartment (code, building, floor, area, status, contract) VALUES
                                                                          -- Tòa nhà A
                                                                          ('A101', 'A', 1, 75.5, 'Còn trống', NULL),
                                                                          ('A102', 'A', 1, 80.0, 'Đã mua', 'Contract A102'),
                                                                          ('A103', 'A', 1, 90.0, 'Đã thuê', 'Contract A103'),
                                                                          ('A104', 'A', 1, 85.0, 'Còn trống', NULL),
                                                                          ('A105', 'A', 1, 70.0, 'Đã mua', 'Contract A105'),
                                                                          ('A106', 'A', 1, 95.0, 'Đã thuê', 'Contract A106'),
                                                                          ('A107', 'A', 1, 75.0, 'Còn trống', NULL),
                                                                          ('A108', 'A', 1, 80.0, 'Đã mua', 'Contract A108'),
                                                                          ('A109', 'A', 1, 85.0, 'Đã thuê', 'Contract A109'),
                                                                          ('A110', 'A', 1, 90.0, 'Còn trống', NULL),
                                                                          ('A1001', 'A', 10, 75.5, 'Còn trống', NULL),
                                                                          ('A1002', 'A', 10, 80.0, 'Đã mua', 'Contract A1002'),
                                                                          ('A1003', 'A', 10, 90.0, 'Đã thuê', 'Contract A1003'),
                                                                          ('A1004', 'A', 10, 85.0, 'Còn trống', NULL),
                                                                          ('A1005', 'A', 10, 70.0, 'Đã mua', 'Contract A1005'),
                                                                          ('A1006', 'A', 10, 95.0, 'Đã thuê', 'Contract A1006'),
                                                                          ('A1007', 'A', 10, 75.0, 'Còn trống', NULL),
                                                                          ('A1008', 'A', 10, 80.0, 'Đã mua', 'Contract A1008'),
                                                                          ('A1009', 'A', 10, 85.0, 'Đã thuê', 'Contract A1009'),
                                                                          ('A1010', 'A', 10, 90.0, 'Còn trống', NULL),

                                                                          -- Tòa nhà B
                                                                          ('B201', 'B', 2, 75.5, 'Còn trống', NULL),
                                                                          ('B202', 'B', 2, 85.0, 'Đã mua', 'Contract B202'),
                                                                          ('B203', 'B', 2, 95.0, 'Đã thuê', 'Contract B203'),
                                                                          ('B204', 'B', 2, 80.0, 'Còn trống', NULL),
                                                                          ('B205', 'B', 2, 70.0, 'Đã mua', 'Contract B205'),
                                                                          ('B206', 'B', 2, 90.0, 'Đã thuê', 'Contract B206'),
                                                                          ('B207', 'B', 2, 75.0, 'Còn trống', NULL),
                                                                          ('B208', 'B', 2, 85.0, 'Đã mua', 'Contract B208'),
                                                                          ('B209', 'B', 2, 80.0, 'Đã thuê', 'Contract B209'),
                                                                          ('B210', 'B', 2, 95.0, 'Còn trống', NULL),

                                                                          -- Tòa nhà C
                                                                          ('C301', 'C', 3, 75.5, 'Còn trống', NULL),
                                                                          ('C302', 'C', 3, 85.0, 'Đã mua', 'Contract C302'),
                                                                          ('C303', 'C', 3, 95.0, 'Đã thuê', 'Contract C303'),
                                                                          ('C304', 'C', 3, 80.0, 'Còn trống', NULL),
                                                                          ('C305', 'C', 3, 70.0, 'Đã mua', 'Contract C305'),
                                                                          ('C306', 'C', 3, 90.0, 'Đã thuê', 'Contract C306'),
                                                                          ('C307', 'C', 3, 75.0, 'Còn trống', NULL),
                                                                          ('C308', 'C', 3, 85.0, 'Đã mua', 'Contract C308'),
                                                                          ('C309', 'C', 3, 80.0, 'Đã thuê', 'Contract C309'),
                                                                          ('C310', 'C', 3, 95.0, 'Còn trống', NULL),

                                                                          -- Tòa nhà D
                                                                          ('D401', 'D', 4, 75.5, 'Còn trống', NULL),
                                                                          ('D402', 'D', 4, 85.0, 'Đã mua', 'Contract D402'),
                                                                          ('D403', 'D', 4, 95.0, 'Đã thuê', 'Contract D403'),
                                                                          ('D404', 'D', 4, 80.0, 'Còn trống', NULL),
                                                                          ('D405', 'D', 4, 70.0, 'Đã mua', 'Contract D405'),
                                                                          ('D406', 'D', 4, 90.0, 'Đã thuê', 'Contract D406'),
                                                                          ('D407', 'D', 4, 75.0, 'Còn trống', NULL),
                                                                          ('D408', 'D', 4, 85.0, 'Đã mua', 'Contract D408'),
                                                                          ('D409', 'D', 4, 80.0, 'Đã thuê', 'Contract D409'),
                                                                          ('D410', 'D', 4, 95.0, 'Còn trống', NULL),

                                                                          -- Tòa nhà E
                                                                          ('E501', 'E', 5, 75.5, 'Còn trống', NULL),
                                                                          ('E502', 'E', 5, 85.0, 'Đã mua', 'Contract E502'),
                                                                          ('E503', 'E', 5, 95.0, 'Đã thuê', 'Contract E503'),
                                                                          ('E504', 'E', 5, 80.0, 'Còn trống', NULL),
                                                                          ('E505', 'E', 5, 70.0, 'Đã mua', 'Contract E505'),
                                                                          ('E506', 'E', 5, 90.0, 'Đã thuê', 'Contract E506'),
                                                                          ('E507', 'E', 5, 75.0, 'Còn trống', NULL),
                                                                          ('E508', 'E', 5, 85.0, 'Đã mua', 'Contract E508'),
                                                                          ('E509', 'E', 5, 80.0, 'Đã thuê', 'Contract E509'),
                                                                          ('E510', 'E', 5, 95.0, 'Còn trống', NULL);
INSERT INTO Resident_Apartment (residentId, apartmentId, isOwner, moveInDate, moveOutDate) VALUES
                                                                                               -- Building A
                                                                                               (1, 2, TRUE, '2023-01-01', NULL), -- Pham Thi D sở hữu căn A102
                                                                                               (2, 3, FALSE, '2023-02-01', NULL), -- Hoang Van E thuê căn A103
                                                                                               (3, 5, TRUE, '2022-05-15', NULL), -- Nguyen Van F sở hữu căn A105
                                                                                               (4, 6, FALSE, '2023-03-10', NULL), -- Tran Thi G thuê căn A106
                                                                                               (5, 8, TRUE, '2021-11-20', NULL), -- Le Van H sở hữu căn A108
                                                                                               (6, 9, FALSE, '2023-04-01', NULL), -- Pham Thi I thuê căn A109
                                                                                               (7, 12, TRUE, '2023-05-01', NULL), -- Hoang Van J sở hữu căn A1002
                                                                                               (8, 13, FALSE, '2023-06-01', NULL), -- Vu Thi K thuê căn A1003
                                                                                               (9, 15, TRUE, '2023-07-01', NULL), -- Do Van L sở hữu căn A1005
                                                                                               (10, 16, FALSE, '2023-08-01', NULL), -- Bui Thi M thuê căn A1006

                                                                                               -- Building B
                                                                                               (11, 22, TRUE, '2023-09-01', NULL), -- Nguyen Van N sở hữu căn B202
                                                                                               (12, 23, FALSE, '2023-10-01', NULL), -- Tran Thi O thuê căn B203

                                                                                               -- Building C
                                                                                               (1, 32, TRUE, '2023-11-01', NULL), -- Pham Thi D sở hữu căn C302
                                                                                               (2, 33, FALSE, '2023-12-01', NULL), -- Hoang Van E thuê căn C303

                                                                                               -- Building D
                                                                                               (3, 42, TRUE, '2024-01-01', NULL), -- Nguyen Van F sở hữu căn D402
                                                                                               (4, 43, FALSE, '2024-02-01', NULL), -- Tran Thi G thuê căn D403

                                                                                               -- Building E
                                                                                               (5, 52, TRUE, '2024-03-01', NULL), -- Le Van H sở hữu căn E502
                                                                                               (6, 53, FALSE, '2024-04-01', NULL); -- Pham Thi I thuê căn E503
INSERT INTO Task (title, description, deadline, status, departmentId, employeeId) VALUES
                                                                                      ('Sửa thang máy', 'Sửa chữa thang máy tại tòa nhà A', '2025-05-15', 'Đang chờ xử lý', 2, 1),
                                                                                      ('Cập nhật phần mềm', 'Nâng cấp hệ thống công nghệ thông tin', '2025-06-01', 'Đang thực hiện', 3, 2),
                                                                                      ('Kiểm tra hệ thống điện', 'Kiểm tra và bảo trì hệ thống điện tại tòa nhà B', '2025-05-20', 'Đã hoàn thành', 2, 3),
                                                                                      ('Vệ sinh khu vực công cộng', 'Dọn dẹp và vệ sinh khu vực công cộng tại tòa nhà C', '2025-05-25', 'Đang thực hiện', 7, 4),
                                                                                      ('Bảo trì hệ thống nước', 'Kiểm tra và sửa chữa hệ thống cấp nước tại tòa nhà D', '2025-06-10', 'Đang chờ xử lý', 2, 5),
                                                                                      ('Giải quyết khiếu nại', 'Xử lý khiếu nại về tiếng ồn từ cư dân', '2025-05-30', 'Đã hoàn thành', 8, 6),
                                                                                      ('Lắp đặt camera an ninh', 'Lắp đặt thêm camera an ninh tại tòa nhà E', '2025-06-15', 'Đang thực hiện', 6, 7),
                                                                                      ('Kiểm tra hệ thống phòng cháy', 'Kiểm tra và bảo trì hệ thống phòng cháy chữa cháy', '2025-06-20', 'Đang chờ xử lý', 2, 8),
                                                                                      ('Cập nhật dữ liệu cư dân', 'Cập nhật thông tin cư dân vào hệ thống', '2025-06-05', 'Đã hoàn thành', 4, 9),
                                                                                      ('Tổ chức sự kiện cư dân', 'Chuẩn bị và tổ chức sự kiện giao lưu cư dân', '2025-06-25', 'Đang thực hiện', 8, 10);
INSERT INTO Fee (name, type, price)
VALUES
    ('Phí điện', 'Tiện ích', 0.25),
    ('Phí nước', 'Tiện ích', 0.10),
    ('Phí dịch vụ bể bơi', 'Dịch vụ', 50000.00),
    ('Phí dịch vụ GYM', 'Dịch vụ', 100000.00),
    ('Phí internet', 'Tiện ích', 300000.00);
INSERT INTO Maintenance (title, description, time, status, employeeId)
VALUES
    ('Sửa đường ống nước tầng 2', 'Phát hiện rò rỉ tại phòng kỹ thuật tầng 2', '2025-05-05 09:00:00', 'Đã tiếp nhận', 2),
    ('Kiểm tra hệ thống camera', 'Camera hành lang block B không hoạt động', '2025-05-06 13:30:00', 'Đang xử lý', 10);

INSERT INTO Repair (title, description, status, residentId, employeeId)
VALUES
    ('Sửa máy lạnh phòng khách', 'Máy lạnh không hoạt động, cần kiểm tra gas và board mạch', 'Đã tiếp nhận', 1, null),
    ('Sửa bồn rửa bếp bị nghẹt', 'Nước không thoát được, có mùi hôi', 'Đang xử lý', 2, 10),
    ('Thay bóng đèn ban công', 'Bóng đèn bị cháy, không sáng', 'Hoàn thành', 3, 2),
    ('Kiểm tra ổ điện phòng ngủ', 'Có tia lửa khi cắm thiết bị, cần kiểm tra an toàn điện', 'Chờ xử lý', 4, 10),
    ('Sửa vòi sen phòng tắm', 'Nước phun yếu, nghi bị nghẹt cặn hoặc hỏng gioăng', 'Đang xử lý', 5, 2);

INSERT INTO Complaint (title, content, status, residentId, departmentId)
VALUES
    ('Tiếng ồn vào ban đêm', 'Có tiếng ồn lớn từ căn hộ tầng trên sau 23h, ảnh hưởng đến giấc ngủ', 'Đã tiếp nhận', 1, 1),
    ('Thang máy bị rung lắc', 'Khi sử dụng thang máy block B, cảm giác rung và dừng đột ngột, cần kiểm tra', 'Đang xử lý', 2, 2),
    ('Rác không được thu gom', 'Khu vực hành lang tầng 3 có rác tồn đọng nhiều ngày', 'Đã tiếp nhận', 3, 3),
    ('Người lạ ra vào tự do', 'Phát hiện người lạ vào khu căn hộ mà không có sự kiểm tra', 'Chờ xử lý', 4, 4),
    ('Hành lang bị mất đèn', 'Đèn hành lang block A không sáng vào ban đêm', 'Đã tiếp nhận', 5, 2);
INSERT INTO Notification (title, content, status, employeeId)
VALUES
    ('Lịch bảo trì hệ thống điện', 'Thông báo cư dân về việc bảo trì hệ thống điện vào ngày 15/05 từ 08:00 - 12:00. Vui lòng không sử dụng các thiết bị điện trong thời gian này.', 'Hiển thị', 1),

    ('Cảnh báo thời tiết xấu', 'Dự báo có mưa lớn và giông lốc chiều nay. Cư dân nên đóng cửa sổ và tránh ra ngoài trừ khi cần thiết.', 'Hiển thị', 2),

    ('Vệ sinh bể nước định kỳ', 'Cư dân khu A lưu ý việc vệ sinh bể nước sẽ diễn ra vào ngày 17/05. Có thể bị gián đoạn cấp nước tạm thời.', 'Hiển thị', 3),

    ('Sự cố thang máy block B', 'Thang máy block B đang được kiểm tra kỹ thuật do có hiện tượng rung. Dự kiến hoạt động trở lại vào ngày mai.', 'Ẩn', 4),

    ('Cập nhật ứng dụng cư dân', 'Ứng dụng ApartMaster đã cập nhật phiên bản mới. Cư dân vui lòng cập nhật để sử dụng các tính năng mới.', 'Hiển thị', 5);

INSERT INTO Vehicle (licensePlate, type, residentId)
VALUES
    ('59A1-123.45', 'Xe máy', 1),
    ('51G-678.90', 'Ô tô', 2),
    ('59X1-456.78', 'Xe máy', 3),
    ('51B-234.56', 'Ô tô', 4),
    ('KH-001.23', 'Xe đạp', 5);
INSERT INTO Service (name, description, feeId)
VALUES
    ('Dịch vụ bể bơi', 'Sử dụng hồ bơi chung cư trong giờ hoạt động (6h - 21h).', 3),
    ('Dịch vụ phòng GYM', 'Phòng GYM với đầy đủ thiết bị hiện đại, mở cửa 6h - 22h.', 4);

INSERT INTO Service_Resident (serviceId, residentId, startDate, endDate, rating)
VALUES
    (1, 1, '2025-01-01', '2025-06-30', 5),
    (1, 2, '2025-03-01', '2025-09-01', 4),
    (2, 2, '2025-04-01', '2025-10-01', 5),
    (2, 3, '2025-02-15', '2025-08-15', 3),
    (1, 4, '2025-05-01', '2025-11-01', 4),
    (2, 5, '2025-01-10', '2025-07-10', 5);
INSERT INTO Bill (month, money, isPaid, paymentMethod, apartmentId) VALUES
                                                                        ('2024-01', 0, false, 'Tiền mặt', 1),
                                                                        ('2024-01', 0, false, 'Chuyển khoản', 2),
                                                                        ('2024-01', 0, false, 'Chuyển khoản', 3);
INSERT INTO Apartment_Fee (apartmentId, feeId, amount) VALUES
                                                 (1, 2, 3),  -- Phí dịch vụ
                                                 (1, 3, 3),  -- Phí gửi xe
                                                 (1, 5,  2); -- Phí gửi xe