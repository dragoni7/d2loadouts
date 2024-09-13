import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { armor, ExoticClassCombo, StatName } from '../types/d2l-types';

interface DashboardState {
  selectedValues: { [key: string]: number };
  selectedExotic: { itemHash: number | null; slot: armor | null };
  selectedExoticClassCombo: ExoticClassCombo | null;
  selectedPermutationStats: { [key in StatName]: number };
}

const initialState: DashboardState = {
  selectedValues: {},
  selectedExotic: { itemHash: null, slot: null },
  selectedExoticClassCombo: null,
  selectedPermutationStats: {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0,
  },
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
    updateSelectedExoticClassCombo: (state, action: PayloadAction<ExoticClassCombo | null>) => {
      state.selectedExoticClassCombo = action.payload;
    },
    updateSelectedPermutationStats: (
      state,
      action: PayloadAction<{ [key in StatName]: number }>
    ) => {
      state.selectedPermutationStats = action.payload;
    },
  },
});

export const {
  updateSelectedValues,
  updateSelectedExoticItemHash,
  updateSelectedExoticClassCombo,
  updateSelectedPermutationStats,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
