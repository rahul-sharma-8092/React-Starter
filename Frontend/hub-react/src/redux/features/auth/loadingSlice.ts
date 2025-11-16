import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
    global: boolean;
}
const initialState: LoadingState = { global: false };

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.global = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
