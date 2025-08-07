import type { Dispatch } from '@reduxjs/toolkit';
import { setAlert, setError, setLoading, setNote } from './alertSlice';
import { fetchAlertById, updateAlertNote } from '../../api/alertService';

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

export const updateAlertNoteThunk =
	(alertId: string, note: string) => async (dispatch: Dispatch) => {
		try {
			dispatch(setLoading(true));

			const updatedNote = await updateAlertNote(alertId, note);

			dispatch(setNote(updatedNote.resolutionNotes!));

			dispatch(setLoading(false));
		} catch (error) {
			const err = error as Error;

			dispatch(setError(err.message));
		} finally {
			dispatch(setLoading(false));
		}
	};
