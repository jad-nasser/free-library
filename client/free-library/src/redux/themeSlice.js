import { createSlice } from "@reduxjs/toolkit";
let initialState = {
  color: "black",
  mode: "light",
};
const themeSlice = createSlice({
  initialState,
  name: "theme",
  reducers: {
    changeThemeColor: (state, action) => {
      state.color = action.payload;
    },
    changeThemeMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});
export const { changeThemeColor, changeThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
