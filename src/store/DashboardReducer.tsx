import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  selectedValues: { [key: string]: number };
  selectedExoticItemHash: string | null;
}

const initialState: DashboardState = {
  selectedValues: {},
  selectedExoticItemHash: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateSelectedValues: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.selectedValues = action.payload;
    },
    updateSelectedExoticItemHash: (state, action: PayloadAction<string | null>) => {
      state.selectedExoticItemHash = action.payload;
    },
  },
});

export const { updateSelectedValues, updateSelectedExoticItemHash } = dashboardSlice.actions;

export default dashboardSlice.reducer;
