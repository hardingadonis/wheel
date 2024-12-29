import { configureStore } from '@reduxjs/toolkit';
import spinReducer from './spinSlice';

const store = configureStore({
	reducer: {
		spin: spinReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
