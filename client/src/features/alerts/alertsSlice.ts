import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Alert, AlertStatus } from '../../types/alert';

type AlertFilter = 'ALL' | AlertStatus;

interface AlertsState {
	alerts: Alert[];
	filters: {
		status: AlertStatus | 'ALL';
		severity: string;
		service: string;
	};
	activeFilter: AlertFilter;
	loading: boolean;
	error: string | null;
}

const initialState: AlertsState = {
	alerts: [],
	filters: {
		status: 'OPEN',
		severity: '',
		service: 'order-service',
	},
	activeFilter: 'ALL',
	loading: false,
	error: null,
};

const alertsSlice = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		setAlerts: (state, action: PayloadAction<Alert[]>) => {
			state.alerts = action.payload;
		},
		addAlert: (state, action: PayloadAction<Alert>) => {
			state.alerts = [action.payload, ...state.alerts];
		},
		updateAlert: (
			state,
			action: PayloadAction<Partial<Alert> & { id: string }>
		) => {
			const index = state.alerts.findIndex((a) => a.id === action.payload.id);
			if (index !== -1) {
				state.alerts[index] = {
					...state.alerts[index],
					...action.payload,
					updatedAt: new Date().toISOString(),
				};
			}
		},
		setFilters: (
			state,
			action: PayloadAction<Partial<AlertsState['filters']>>
		) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		setActiveFilter: (state, action: PayloadAction<AlertFilter>) => {
			state.activeFilter = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	setAlerts,
	addAlert,
	updateAlert,
	setFilters,
	setActiveFilter,
	setLoading,
	setError,
} = alertsSlice.actions;
export default alertsSlice.reducer;
