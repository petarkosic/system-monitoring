import type { Dispatch } from '@reduxjs/toolkit';
import { setAlert, setError, setLoading } from './alertSlice';
import { fetchAlertById } from '../../api/alertService';

export const loadAlert = (id: string) => async (dispatch: Dispatch) => {
	try {
		dispatch(setLoading(true));

		const alert = await fetchAlertById(id);

		dispatch(setAlert(alert));
	} catch (error) {
		const err = error as Error;

		dispatch(setError(err.message));
	} finally {
		dispatch(setLoading(false));
	}
};
