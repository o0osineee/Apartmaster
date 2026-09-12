const VehicleModel = require('../models/vehicleModel');
const ResidentModel = require('../models/residentModel'); // Needed to check if resident exists

const VehicleService = {
  createVehicle: async (vehicleData) => {
    // Optional: Check if residentId exists before attempting to create
    const resident = await ResidentModel.getById(vehicleData.residentId);
    if (!resident) {
      throw new Error('Cannot create vehicle: Resident with the provided ID does not exist.');
    }
    return VehicleModel.createVehicle(vehicleData);
  },

  getAllVehicles: async () => {
    return VehicleModel.getAllVehicles();
  },

  getVehicleById: async (vehicleId) => {
    return VehicleModel.getVehicleById(vehicleId);
  },
  
  getVehiclesByResidentId: async (residentId) => {
    return VehicleModel.getVehiclesByResidentId(residentId);
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const existingVehicle = await VehicleModel.getVehicleById(vehicleId);
    if (!existingVehicle) {
        return null; // Or throw a 404 error in controller
    }

    // If residentId is being updated, check if the new residentId exists
    if (vehicleData.residentId && vehicleData.residentId !== existingVehicle.resident.residentId) {
        const newResident = await ResidentModel.getById(vehicleData.residentId);
        if (!newResident) {
            throw new Error('Cannot update vehicle: New Resident ID does not exist.');
        }
    }

    const dataToUpdate = {
        licensePlate: vehicleData.licensePlate !== undefined ? vehicleData.licensePlate : existingVehicle.licensePlate,
        type: vehicleData.type !== undefined ? vehicleData.type : existingVehicle.type,
        residentId: vehicleData.residentId !== undefined ? vehicleData.residentId : existingVehicle.resident.residentId,
    };

    return VehicleModel.updateVehicle(vehicleId, dataToUpdate);
  },

  deleteVehicle: async (vehicleId) => {
    return VehicleModel.deleteVehicle(vehicleId);
  }
};

module.exports = VehicleService; 