import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from '../features/alerts/alertsSlice';

export const store = configureStore({
	reducer: {
		alerts: alertsReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // For Date objects in alerts
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
