import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArmorSlot, ExoticClassCombo } from '../types/d2l-types';

interface DashboardState {
  selectedValues: { [key: string]: number };
  selectedExotic: { itemHash: number | null; slot: ArmorSlot | null };
  selectedExoticClassCombo: ExoticClassCombo | null;
  selectedCharacter: number;
  assumeMasterwork: boolean;
  assumeExoticArtifice: boolean;
}

const initialState: DashboardState = {
  selectedValues: {},
  selectedExotic: { itemHash: null, slot: null },
  selectedExoticClassCombo: null,
  selectedCharacter: 0,
  assumeMasterwork: true,
  assumeExoticArtifice: true,
};

/**
 * States related to the app dashboard
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateSelectedValues: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.selectedValues = action.payload;
    },
    updateSelectedExoticItemHash: (
      state,
      action: PayloadAction<{ itemHash: number | null; slot: ArmorSlot | null }>
    ) => {
      state.selectedExotic = action.payload;
    },
    updateSelectedExoticClassCombo: (state, action: PayloadAction<ExoticClassCombo | null>) => {
      state.selectedExoticClassCombo = action.payload;
    },
    updateSelectedCharacter: (state, action: PayloadAction<number>) => {
      state.selectedCharacter = action.payload;
    },
    updateAssumeMasterwork: (state) => {
      state.assumeMasterwork = !state.assumeMasterwork;
    },
    updateAssumeExoticArtifice: (state) => {
      state.assumeExoticArtifice = !state.assumeExoticArtifice;
    },
    resetDashboard: () => initialState,
  },
});

export const {
  updateSelectedValues,
  updateSelectedExoticItemHash,
  updateSelectedExoticClassCombo,
  updateSelectedCharacter,
  updateAssumeMasterwork,
  updateAssumeExoticArtifice,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
