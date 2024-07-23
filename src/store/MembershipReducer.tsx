import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DestinyMembership } from '../types';

export interface InitialState {
  membership: DestinyMembership;
}
const initialState: InitialState = {
  membership: { membershipId: '', membershipType: 0 },
};

export const membershipSlice = createSlice({
  name: 'destinyMembership',
  initialState,
  reducers: {
    updateMembership: (state, action: PayloadAction<DestinyMembership>) => {
      state.membership = action.payload;
    },
  },
});

export const { updateMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
