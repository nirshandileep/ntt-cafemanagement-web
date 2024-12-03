// redux/cafesSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [
    {
      id: '123',
      name: 'Cafe 1',
      description: 'Cafe 1 lovers.',
      location: 'Location A',
      logo: '',
    },
    {
      id: '456',
      name: 'Cafe 2',
      description: 'Cafe 2 lovers.',
      location: 'Location B',
      logo: '',
    },
    {
      id: uuidv4(),
      name: 'Cafe 3',
      description: 'Cafe 3 lovers.',
      location: 'Location C',
      logo: '',
    },
    {
      id: uuidv4(),
      name: 'Cafe 4',
      description: 'Cafe 4 lovers.',
      location: 'Location D',
      logo: '',
    },
  ],
};

const cafesSlice = createSlice({
  name: 'cafes',
  initialState,
  reducers: {
    addCafe: (state, action) => {
      state.items.push(action.payload);
    },
    updateCafe: (state, action) => {
      const index = state.items.findIndex((cafe) => cafe.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCafe: (state, action) => {
      state.items = state.items.filter((cafe) => cafe.id !== action.payload);
    },
  },
});

export const { addCafe, updateCafe, deleteCafe } = cafesSlice.actions;

// Selector to get the cafes list
export const selectCafes = (state) => state.cafes.items;

export default cafesSlice.reducer;
