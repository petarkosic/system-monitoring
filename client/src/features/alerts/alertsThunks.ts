import { setAlerts, setLoading, setError, updateAlert } from './alertsSlice';
import { fetchAlerts, updateAlertStatus } from '../../api/alertService';
import type { Dispatch } from '@reduxjs/toolkit';
import type { Alert, AlertStatus } from '../../types/alert';

type Error = { message: string };

export const loadInitialAlerts = () => async (dispatch: Dispatch) => {
	try {
		dispatch(setLoading(true));

		const alerts = await fetchAlerts();

		dispatch(setAlerts(alerts));
	} catch (error) {
		const err = error as Error;

		dispatch(setError(err.message));
	} finally {
		dispatch(setLoading(false));
	}
};

export const updateAlertStatusThunk =
	(alertId: string, status: AlertStatus) => async (dispatch: Dispatch) => {
		try {
			dispatch(setLoading(true));

			dispatch(
				updateAlert({
					id: alertId,
					status: status,
				} as Alert)
			);

			await updateAlertStatus(alertId, status);

			dispatch(setLoading(false));
		} catch (error) {
			const err = error as Error;
			dispatch(setError(err.message));
		} finally {
			dispatch(setLoading(false));
		}
	};
