const ServiceModel = require('../models/serviceModel');

function notFound(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

function conflict(message) {
  const err = new Error(message);
  err.statusCode = 409;
  return err;
}

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

const ServiceService = {
  // Lấy tất cả dịch vụ
  async getAllServices() {
    return await ServiceModel.getAll();
  },

  // Lấy thông tin một dịch vụ theo ID
  async getServiceById(id) {
    const service = await ServiceModel.getById(id);
    if (!service) {
      throw notFound('Không tìm thấy dịch vụ');
    }
    return service;
  },

  // Tạo dịch vụ mới
  async createService(serviceData) {
    // Kiểm tra tên dịch vụ đã tồn tại chưa
    const existingService = await ServiceModel.findByName(serviceData.name);
    if (existingService) {
      throw conflict('Service name already exists.');
    }

    // Kiểm tra feeId có tồn tại không
    const isValidFee = await ServiceModel.validateFeeId(serviceData.feeId);
    if (!isValidFee) {
      throw badRequest('Invalid fee ID.');
    }

    return await ServiceModel.create(serviceData);
  },

  // Cập nhật thông tin dịch vụ
  async updateService(id, serviceData) {
    // Kiểm tra dịch vụ có tồn tại không
    const existingService = await ServiceModel.getById(id);
    if (!existingService) {
      throw notFound('Không tìm thấy dịch vụ');
    }

    // Nếu có cập nhật tên, kiểm tra tên mới có bị trùng không
    if (serviceData.name && serviceData.name !== existingService.name) {
      const nameExists = await ServiceModel.findByName(serviceData.name);
      if (nameExists) {
        throw conflict('Service name already exists.');
      }
    }

    // Nếu có cập nhật feeId, kiểm tra feeId mới có hợp lệ không
    if (serviceData.feeId && serviceData.feeId !== existingService.feeId) {
      const isValidFee = await ServiceModel.validateFeeId(serviceData.feeId);
      if (!isValidFee) {
        throw badRequest('Invalid fee ID.');
      }
    }

    return await ServiceModel.update(id, serviceData);
  },

  // Xóa dịch vụ (soft delete)
  async deleteService(id) {
    const service = await ServiceModel.getById(id);
    if (!service) {
      throw notFound('Không tìm thấy dịch vụ');
    }
    return await ServiceModel.softDelete(id);
  },

  // Lấy danh sách cư dân đăng ký dịch vụ
  async getRegisteredResidents(serviceId) {
    // Kiểm tra dịch vụ có tồn tại không
    const service = await ServiceModel.getById(serviceId);
    if (!service) {
      throw notFound('Không tìm thấy dịch vụ');
    }

    // Danh sách rỗng là kết quả hợp lệ (dịch vụ chưa có ai đăng ký), không phải lỗi
    return await ServiceModel.getRegisteredResidents(serviceId);
  }
};

module.exports = ServiceService;
