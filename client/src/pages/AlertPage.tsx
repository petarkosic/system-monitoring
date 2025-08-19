import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadAlert, updateAlertNoteThunk } from '../features/alert/alertThunks';
import { useNavigate, useParams } from 'react-router-dom';
import type { AlertStatus } from '../types/alert';
import { updateAlertStatusThunk } from '../features/alerts/alertsThunks';
import { format } from 'date-fns';

const severityClasses = {
	CRITICAL: 'bg-red-50 border-red-500',
	HIGH: 'bg-orange-50 border-orange-500',
	MEDIUM: 'bg-yellow-50 border-yellow-500',
	LOW: 'bg-green-50 border-green-500',
};

const statusOptions: { value: AlertStatus; label: string }[] = [
	{ value: 'OPEN', label: 'Open' },
	{ value: 'IN_PROGRESS', label: 'In Progress' },
	{ value: 'RESOLVED', label: 'Resolved' },
	{ value: 'DISMISSED', label: 'Dismissed' },
];

export const AlertPage = () => {
	const [note, setNote] = useState<string>('');

	const dispatch = useAppDispatch();
	const { alert } = useAppSelector((state) => state.alert);

	const { id: alertId } = useParams();
	const navigate = useNavigate();

	const handleStatusChange = (newStatus: AlertStatus) => {
		dispatch(updateAlertStatusThunk(alert.id, newStatus));

		navigate(0);
	};

	const handleNoteSubmit = (note: string) => {
		dispatch(updateAlertNoteThunk(alert.id, note));

		navigate(0);
	};

	useEffect(() => {
		dispatch(loadAlert(alertId as string));
	}, [dispatch]);

	return (
		<div className='container mx-auto p-4'>
			<button
				className='px-3 py-2 mb-4 rounded bg-black hover:bg-gray-600 cursor-pointer'
				onClick={() => navigate(-1)}
			>
				Go Back
			</button>

			<div
				className={`p-4 mb-4 rounded-lg border-l-4 text-black ${severityClasses[
					alert?.severity?.toUpperCase() as keyof typeof severityClasses
				]!}`}
			>
				<h1 className='font-bold text-gray-900 text-sm'>Event ID: {alertId}</h1>

				<p className='mb-4 text-sm text-gray-600'>
					{format(new Date(alert?.createdAt || new Date()), 'PPpp')}
				</p>

				<table className='min-w-full text-left table-fixed'>
					<thead className='border-b'>
						<tr>
							<th className='w-12 px-4 py-2'>Rule Type</th>
							<th className='w-48 px-4 py-2'>Message</th>
							<th className='w-32 px-4 py-2'>Service</th>
							<th className='w-12 px-4 py-2'>Type</th>
							<th className='w-12 px-4 py-2'>Severity</th>
							<th className='w-12 px-4 py-2'>Status</th>
							<th className='w-48 px-4 py-2'>Note</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='px-4 py-2'>{alert?.ruleType}</td>
							<td className='px-4 py-2'>{alert?.payload?.message}</td>
							<td className='px-4 py-2'>{alert?.service}</td>
							<td className='px-4 py-2'>
								{alert?.payload?.type.toUpperCase()}
							</td>
							<td className='px-4 py-2'>{alert?.severity.toUpperCase()}</td>
							<td className='px-4 py-2'>{alert?.status}</td>
							<td className='px-4 py-2'>
								{alert?.resolutionNotes || alert?.status === 'DISMISSED' ? (
									<div className='p-2 bg-gray-100 rounded'>
										{alert?.resolutionNotes || 'No notes'}
									</div>
								) : (
									<form
										onSubmit={(e) => {
											e.preventDefault();
											if (note.trim()) {
												handleNoteSubmit(note);
												setNote('');
											}
										}}
									>
										<textarea
											name='note'
											style={{ resize: 'none', height: '100px' }}
											value={note}
											onChange={(e) => setNote(e.target.value)}
											className='w-full bg-gray-50'
										></textarea>
										<button
											type='submit'
											className='mt-2 px-4 py-2 bg-black text-white hover:bg-gray-600 rounded cursor-pointer'
										>
											Submit
										</button>
									</form>
								)}
							</td>
						</tr>
					</tbody>
				</table>

				<div className='flex flex-wrap gap-2 mt-3 text-white'>
					{statusOptions.map((option) => (
						<button
							key={option.value}
							onClick={() => handleStatusChange(option.value)}
							disabled={alert.status === option.value}
							className={`px-3 py-2 text-sm rounded bg-black ${
								alert.status === option.value
									? 'text-gray-500 !border-none !cursor-not-allowed'
									: 'border border-none hover:bg-gray-600 cursor-pointer'
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
