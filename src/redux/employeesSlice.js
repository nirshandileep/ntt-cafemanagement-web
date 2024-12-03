import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '81117222', daysWorked: 30, cafeId: '123', cafeName: 'Cafe 1', gender: 'Male' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '91117222', daysWorked: 45, cafeId: '123', cafeName: 'Cafe 1', gender: 'Female' },
    { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '95643456', daysWorked: 20, cafeId: '456', cafeName: 'Cafe 2', gender: 'Female' },
    { id: '4', name: 'Bob Brown', email: 'bob@example.com', phone: '84536786', daysWorked: 10, cafeId: '456', cafeName: 'Cafe 2', gender: 'Male' },
  ]
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.items.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.items.findIndex(employee => employee.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.items = state.items.filter(employee => employee.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
