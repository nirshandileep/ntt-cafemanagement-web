import { configureStore } from '@reduxjs/toolkit';
import cafesReducer from './cafesSlice';
import employeesReducer from './employeesSlice';

const store = configureStore({
  reducer: {
    cafes: cafesReducer,
    employees: employeesReducer,
  },
});

export default store;
