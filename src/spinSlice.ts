import { createSlice } from '@reduxjs/toolkit';

interface SpinState {
	isSpin: boolean;
}

const initialState: SpinState = {
	isSpin: false,
};

const spinSlice = createSlice({
	name: 'spin',
	initialState,
	reducers: {
		startSpin(state) {
			state.isSpin = true;
		},
		stopSpin(state) {
			state.isSpin = false;
		},
	},
});

export const { startSpin, stopSpin } = spinSlice.actions;
export default spinSlice.reducer;
