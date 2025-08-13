import axios from 'axios';
import type { Alert, AlertStatus } from '../types/alert';

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083/api';

export const fetchAlerts = async (): Promise<Alert[]> => {
	const response = await axios.get<Alert[]>(`${API_BASE_URL}/alerts`);
	return response.data;
};

export const fetchAlertById = async (id: string): Promise<Alert> => {
	const response = await axios.get<Alert>(`${API_BASE_URL}/alerts/${id}`);
	return response.data;
};

export const updateAlertStatus = async (
	alertId: string,
	status: AlertStatus
): Promise<Alert> => {
	const response = await axios.patch<Alert>(
		`${API_BASE_URL}/alerts/${alertId}/status`,
		status,
		{
			headers: { 'Content-Type': 'text/plain' },
		}
	);

	return response.data;
};

export const updateAlertNote = async (alertId: string, note: string) => {
	const response = await axios.patch<Alert>(
		`${API_BASE_URL}/alerts/${alertId}/note`,
		note,
		{
			headers: { 'Content-Type': 'text/plain' },
		}
	);

	return response.data;
};
