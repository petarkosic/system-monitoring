import axios from 'axios';
import type { Alert, UpdateAlertDto } from '../types/alert';

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083/api';

export const fetchAlerts = async (): Promise<Alert[]> => {
	const response = await axios.get<Alert[]>(`${API_BASE_URL}/alerts`);
	return response.data;
};

export const updateAlertStatus = async (
	alertId: string,
	updateData: UpdateAlertDto
): Promise<Alert> => {
	const response = await axios.put<Alert>(
		`${API_BASE_URL}/alerts/${alertId}`,
		updateData
	);

	return response.data;
};
