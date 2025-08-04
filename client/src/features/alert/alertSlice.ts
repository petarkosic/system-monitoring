import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Alert } from '../../types/alert';

interface AlertState {
	alert: Alert;
	loading: boolean;
	error: string | null;
}

const initialState: AlertState = {
	alert: {} as Alert,
	loading: false,
	error: null,
};

const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		setAlert: (state, action: PayloadAction<Alert>) => {
			state.alert = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
});

export const { setAlert, setLoading, setError } = alertSlice.actions;
export default alertSlice.reducer;
