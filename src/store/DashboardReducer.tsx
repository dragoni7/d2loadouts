import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { armor } from '../types/d2l-types';

interface DashboardState {
  selectedValues: { [key: string]: number };
  selectedExotic: { itemHash: number | null; slot: armor | null };
}

const initialState: DashboardState = {
  selectedValues: {},
  selectedExotic: { itemHash: null, slot: null },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateSelectedValues: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.selectedValues = action.payload;
    },
    updateSelectedExoticItemHash: (
      state,
      action: PayloadAction<{ itemHash: number | null; slot: armor | null }>
    ) => {
      state.selectedExotic = action.payload;
    },
  },
});

export const { updateSelectedValues, updateSelectedExoticItemHash } = dashboardSlice.actions;

export default dashboardSlice.reducer;
