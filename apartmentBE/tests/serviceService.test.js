jest.mock('../src/models/serviceModel');

const ServiceModel = require('../src/models/serviceModel');
const ServiceService = require('../src/services/serviceService');

describe('ServiceService (regression for BUG-04: business errors carry the right statusCode)', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('getServiceById throws a 404 (not a generic 500) when the service does not exist', async () => {
    ServiceModel.getById.mockResolvedValue(null);

    await expect(ServiceService.getServiceById(9999)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Không tìm thấy dịch vụ'
    });
  });

  it('createService throws a 409 when the name already exists', async () => {
    ServiceModel.findByName.mockResolvedValue({ serviceId: 1, name: 'Dịch vụ bể bơi' });

    await expect(
      ServiceService.createService({ name: 'Dịch vụ bể bơi', feeId: 1 })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('createService throws a 400 for an invalid feeId', async () => {
    ServiceModel.findByName.mockResolvedValue(null);
    ServiceModel.validateFeeId.mockResolvedValue(false);

    await expect(
      ServiceService.createService({ name: 'Mới', feeId: 9999 })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('getRegisteredResidents returns an empty list instead of treating "no one signed up" as an error', async () => {
    ServiceModel.getById.mockResolvedValue({ serviceId: 1, name: 'Dịch vụ bể bơi' });
    ServiceModel.getRegisteredResidents.mockResolvedValue([]);

    await expect(ServiceService.getRegisteredResidents(1)).resolves.toEqual([]);
  });
});
