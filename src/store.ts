import { configureStore } from '@reduxjs/toolkit';
import spinReducer from './spinSlice';
import rewardReducer from './rewardSlice';

const store = configureStore({
	reducer: {
		spin: spinReducer,
		reward: rewardReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
