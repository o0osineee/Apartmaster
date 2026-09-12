import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import apartmentReducer from './slices/apartmentSlice';
import authReducer from './slices/authSlice';

import taskReducer from './slices/taskSlice';
import departmentReducer from './slices/departmentSlice';
import employeeReducer from './slices/employeeSlice';
import roleReducer from './slices/roleSlice';
import residentReducer from './slices/residentSlice';
import repairReducer from './slices/repairSlice';
import vehicleReducer from './slices/vehicleSlice';
import reportReducer from './slices/reportSlice';

import notificationReducer from './slices/notificationSlice';
import feeReducer from './slices/feeSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import complaintReducer from './slices/complaintSlice';
import serviceReducer from './slices/serviceSlice';
import billReducer from './slices/billSlice';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Chỉ lưu trữ auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  apartments: apartmentReducer,
  tasks: taskReducer,
  departments: departmentReducer,
  employees: employeeReducer,
  roles: roleReducer,
  residents: residentReducer,
  repairs: repairReducer,
  maintenances: maintenanceReducer,
  vehicles: vehicleReducer,
  reports: reportReducer,
  complaints: complaintReducer,
  notifications: notificationReducer,
  fees: feeReducer,
  services: serviceReducer,
  bills: billReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);