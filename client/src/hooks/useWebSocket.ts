import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addAlert, updateAlert } from '../features/alerts/alertsSlice';
import { connectWebSocket } from '../api/webSocketService';
import type { Alert } from '../types/alert';

export const useWebSocket = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const disconnect = connectWebSocket(
			(wsAlert) => {
				const alert: Partial<Alert> = {
					id: wsAlert.id,
					ruleType: wsAlert.ruleType,
					message: wsAlert.message,
					service: wsAlert.service,
					severity: wsAlert.severity as Alert['severity'],
					status: wsAlert.status as Alert['status'],
					createdAt: wsAlert.timestamp,
				};

				dispatch(
					alert.id ? addAlert(alert as Alert) : updateAlert(alert as Alert)
				);
			},
			(error) => {
				console.error('WebSocket error:', error);
			}
		);

		return disconnect;
	}, [dispatch]);
};
