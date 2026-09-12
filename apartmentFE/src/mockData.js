export const mockResidents = [
  {
    residentID: 1,
    fullName: 'Nguyễn Văn A',
    birthDate: '1990-05-15',
    gender: 'Male',
    idNumber: 'ID123456',
    phone: '0123456789',
    email: 'nguyenvana@example.com',
    roleID: 1,
    residentAccountID: 1,
    status: true,
    apartment: {
      code: 'A101',
      building: 'Building A',
      floor: 1
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDeleted: false
  },
  {
    residentID: 2,
    fullName: 'Trần Thị B',
    birthDate: '1988-08-20',
    gender: 'Female',
    idNumber: 'ID789012',
    phone: '0987654321',
    email: 'tranthib@example.com',
    roleID: 1,
    residentAccountID: 2,
    status: true,
    apartment: {
      code: 'B202',
      building: 'Building B',
      floor: 2
    },
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    isDeleted: false
  },
  {
    residentID: 3,
    fullName: 'Lê Văn C',
    birthDate: '1995-03-10',
    gender: 'Male',
    idNumber: 'ID345678',
    phone: '0369852147',
    email: 'levanc@example.com',
    roleID: 1,
    residentAccountID: 3,
    status: false,
    apartment: {
      code: 'C303',
      building: 'Building C',
      floor: 3
    },
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    isDeleted: false
  }
];

export const mockRoles = [
  {
    roleID: 1,
    name: 'Resident',
    description: 'Regular resident with basic permissions',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDeleted: false
  },
  {
    roleID: 2,
    name: 'Admin',
    description: 'Administrator with full permissions',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDeleted: false
  }
];

export const mockApartments = [
  {
    apartmentID: 1,
    code: 'A101',
    building: 'Building A',
    floor: 1,
    area: 80.5,
    status: 'Occupied',
    contractFile: 'contract_a101.pdf',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDeleted: false
  },
  {
    apartmentID: 2,
    code: 'B202',
    building: 'Building B',
    floor: 2,
    area: 90.0,
    status: 'Occupied',
    contractFile: 'contract_b202.pdf',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDeleted: false
  },
  {
    apartmentID: 3,
    code: 'C303',
    building: 'Building C',
    floor: 3,
    area: 75.5,
    status: 'Available',
    contractFile: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDeleted: false
  }
];

export const mockServiceFees = [
  {
    id: 'service_1',
    serviceName: 'Dọn dẹp căn hộ',
    description: 'Dịch vụ dọn dẹp toàn bộ căn hộ, bao gồm: lau sàn, dọn phòng tắm, dọn bếp, hút bụi, thay ga giường.',
    price: 500000,
    type: 'cleaning',
    isActive: true,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_2',
    serviceName: 'Giặt ủi quần áo',
    description: 'Dịch vụ giặt ủi quần áo, bao gồm: giặt, sấy, ủi và gấp quần áo. Không giới hạn số lượng.',
    price: 300000,
    type: 'laundry',
    isActive: true,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_3',
    serviceName: 'Sửa chữa điện nước',
    description: 'Dịch vụ sửa chữa các vấn đề về điện và nước trong căn hộ. Bao gồm: thay bóng đèn, sửa vòi nước, thông cống.',
    price: 800000,
    type: 'repair',
    isActive: true,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_4',
    serviceName: 'Dọn dẹp sâu',
    description: 'Dịch vụ dọn dẹp sâu toàn bộ căn hộ, bao gồm: vệ sinh tủ lạnh, máy giặt, điều hòa, rèm cửa và các khu vực khó tiếp cận.',
    price: 1000000,
    type: 'cleaning',
    isActive: true,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_5',
    serviceName: 'Giặt thảm',
    description: 'Dịch vụ giặt và làm sạch thảm trải sàn. Bao gồm: hút bụi, xử lý vết bẩn, giặt và sấy khô.',
    price: 400000,
    type: 'laundry',
    isActive: true,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_6',
    serviceName: 'Bảo trì điều hòa',
    description: 'Dịch vụ bảo trì và vệ sinh điều hòa. Bao gồm: vệ sinh lưới lọc, kiểm tra gas, bảo dưỡng định kỳ.',
    price: 600000,
    type: 'repair',
    isActive: false,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_7',
    serviceName: 'Dọn dẹp sau sự kiện',
    description: 'Dịch vụ dọn dẹp sau các sự kiện, tiệc tùng. Bao gồm: dọn rác, lau sàn, sắp xếp lại đồ đạc.',
    price: 700000,
    type: 'cleaning',
    isActive: true,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'service_8',
    serviceName: 'Giặt chăn ga gối',
    description: 'Dịch vụ giặt và làm sạch chăn, ga giường, gối. Bao gồm: giặt, sấy và ủi phẳng.',
    price: 450000,
    type: 'laundry',
    isActive: false,
    createdAt: '2024-03-15T08:00:00.000Z',
    updatedAt: '2024-03-15T08:00:00.000Z'
  }
] 