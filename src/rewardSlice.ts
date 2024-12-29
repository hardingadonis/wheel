import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RewardState {
	reward: string | null;
}

const initialState: RewardState = {
	reward: null,
};

const rewardSlice = createSlice({
	name: 'reward',
	initialState,
	reducers: {
		setReward(state, action: PayloadAction<string | null>) {
			state.reward = action.payload;
		},
	},
});

export const { setReward } = rewardSlice.actions;
export default rewardSlice.reducer;
