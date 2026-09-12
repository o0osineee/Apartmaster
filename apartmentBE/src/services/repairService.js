const Repair = require('../models/repairModel');
const ResidentModel = require('../models/residentModel');
const EmployeeModel = require('../models/employeeModel');

const repairService = {
  createRepair: async (repairData) => {
    try {
      return await Repair.createRepair(repairData);
    } catch (error) {
      throw error;
    }
  },

  getAllRepairs: async () => {
    try {
      return await Repair.getAllRepairs();
    } catch (error) {
      throw error;
    }
  },

  getRepairById: async (repairId) => {
    try {
      const repair = await Repair.getRepairById(repairId);
      if (!repair) {
        throw new Error('Repair not found');
      }
      return repair;
    } catch (error) {
      throw error;
    }
  },

  updateRepair: async (repairId, repairData) => {
    try {
      const updatedRepair = await Repair.updateRepair(repairId, repairData);
      if (!updatedRepair) {
        throw new Error('Repair not found');
      }
      return updatedRepair;
    } catch (error) {
      throw error;
    }
  },

  deleteRepair: async (repairId) => {
    try {
      const deleted = await Repair.deleteRepair(repairId);
      if (!deleted) {
        throw new Error('Repair not found');
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  getRepairsByResident: async (residentId) => {
    try {
      return await Repair.getRepairsByResident(residentId);
    } catch (error) {
      throw error;
    }
  },

  getRepairsByEmployee: async (employeeId) => {
    try {
      return await Repair.getRepairsByEmployee(employeeId);
    } catch (error) {
      throw error;
    }
  },

  assignEmployee: async (repairId, employeeId) => {
    try {
      const result = await Repair.assignEmployee(repairId, employeeId);
      if (!result) {
        throw new Error('Repair not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (repairId, status) => {
    try {
      const result = await Repair.updateStatus(repairId, status);
      if (!result) {
        throw new Error('Repair not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = repairService; 