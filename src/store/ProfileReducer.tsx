import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DestinyArmor } from "../types/DestinyTypes";

export interface ProfileInitialState {
  armor: DestinyArmor[];
}
const initialState: ProfileInitialState = {
  armor: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileArmor: (state, action: PayloadAction<DestinyArmor[]>) => {
      state.armor = action.payload;
    },
  },
});

export const { updateProfileArmor } = profileSlice.actions;
export default profileSlice.reducer;
