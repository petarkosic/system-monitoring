import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadAlert } from '../features/alert/alertThunks';
import { useParams } from 'react-router-dom';
import type { LogAlert, MetricAlert, SecurityAlert } from '../types/alert';
import { LogAlertDetails } from '../components/LogAlertDetails';
import { MetricAlertDetails } from '../components/MetricAlertDetails';
import { SecurityAlertDetails } from '../components/SecurityAlertDetails';

export const AlertPage = () => {
	const dispatch = useAppDispatch();
	const { alert } = useAppSelector((state) => state.alert);
	const { id: alertId } = useParams();

	useEffect(() => {
		if (alertId) {
			dispatch(loadAlert(alertId));
		}
	}, [dispatch, alertId]);

	if (!alert) {
		return <div>Loading...</div>;
	}

	if (alert?.payload?.logId) {
		return <LogAlertDetails alert={alert as LogAlert} />;
	}

	if (alert?.payload?.metricId) {
		return <MetricAlertDetails alert={alert as MetricAlert} />;
	}

	if (alert?.payload?.eventId) {
		return <SecurityAlertDetails alert={alert as SecurityAlert} />;
	}

	return <div>Unknown alert type</div>;
};
