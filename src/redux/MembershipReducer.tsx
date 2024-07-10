import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  membershipId: string;
}
const initialState: InitialState = {
  membershipId: "",
};

export const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    updateMembershipId: (state, action: PayloadAction<string>) => {
      state.membershipId = action.payload;
    },
  },
});

export const { updateMembershipId } = membershipSlice.actions;
export default membershipSlice.reducer;
