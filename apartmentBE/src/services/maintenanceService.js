const MaintenanceModel = require('../models/maintenanceModel');
const EmployeeModel = require('../models/employeeModel');

const MaintenanceService = {
  createMaintenance: async (maintenanceData) => {
    const { employeeId } = maintenanceData;
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      const err = new Error('Employee not found for maintenance task.');
      err.statusCode = 400;
      throw err;
    }
    return MaintenanceModel.createMaintenance(maintenanceData);
  },

  getAllMaintenances: async () => {
    return MaintenanceModel.getAllMaintenances();
  },

  getMaintenanceById: async (maintenanceId) => {
    return MaintenanceModel.getMaintenanceById(maintenanceId);
  },

  updateMaintenance: async (maintenanceId, maintenanceData) => {
    const existingMaintenance = await MaintenanceModel.getMaintenanceById(maintenanceId);
    if (!existingMaintenance) {
        return null; // Or throw 404 in controller
    }

    if (maintenanceData.employeeId && maintenanceData.employeeId !== existingMaintenance.employee.employeeId) {
        const employee = await EmployeeModel.getById(maintenanceData.employeeId);
        if (!employee) {
          const err = new Error('New Employee ID for update does not exist.');
          err.statusCode = 400;
          throw err;
        }
    }
    
    // Construct dataToUpdate carefully, only including fields that are actually present in maintenanceData
    // or falling back to existing values if a full update is intended by the model.
    // The current model expects all fields for an update.
    const dataToUpdate = {
        title: maintenanceData.title !== undefined ? maintenanceData.title : existingMaintenance.title,
        description: maintenanceData.description !== undefined ? maintenanceData.description : existingMaintenance.description,
        time: maintenanceData.time !== undefined ? maintenanceData.time : existingMaintenance.time,
        status: maintenanceData.status !== undefined ? maintenanceData.status : existingMaintenance.status,
        createdBy: maintenanceData.createdBy !== undefined ? maintenanceData.createdBy : existingMaintenance.createdBy,
        employeeId: maintenanceData.employeeId !== undefined ? maintenanceData.employeeId : existingMaintenance.employee.employeeId,
    };
    return MaintenanceModel.updateMaintenance(maintenanceId, dataToUpdate);
  },

  deleteMaintenance: async (maintenanceId) => {
    return MaintenanceModel.deleteMaintenance(maintenanceId);
  },

  getMaintenancesByEmployee: async (employeeId) => {
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      const err = new Error('Employee not found.');
      err.statusCode = 404;
      throw err;
    }
    // Optionally, enrich these results with employee details if needed, though model doesn't do it by default for this specific query
    return MaintenanceModel.getMaintenancesByEmployee(employeeId);
  }
};

module.exports = MaintenanceService;
