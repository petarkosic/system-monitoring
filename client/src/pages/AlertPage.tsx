import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadAlert } from '../features/alert/alertThunks';
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
	const dispatch = useAppDispatch();
	const { alert } = useAppSelector((state) => state.alert);

	const { id: alertId } = useParams();
	const navigate = useNavigate();

	const handleStatusChange = (newStatus: AlertStatus) => {
		dispatch(
			updateAlertStatusThunk(alert.id, {
				status: newStatus,
				assignedTo: '',
				resolutionNotes: '',
			})
		);
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

				<table className='min-w-full text-left'>
					<thead className='border-b'>
						<tr>
							<th className='px-4 py-2'>Rule Type</th>
							<th className='px-4 py-2'>Message</th>
							<th className='px-4 py-2'>Service</th>
							<th className='px-4 py-2'>Type</th>
							<th className='px-4 py-2'>Severity</th>
							<th className='px-4 py-2'>Status</th>
							<th className='px-4 py-2'>Note</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='px-4 py-2'>{alert?.ruleType}</td>
							<td className='px-4 py-2'>{alert?.message}</td>
							<td className='px-4 py-2'>{alert?.service}</td>
							<td className='px-4 py-2'>{alert?.payload?.type}</td>
							<td className='px-4 py-2'>{alert?.severity}</td>
							<td className='px-4 py-2'>{alert?.status}</td>
							<td className='px-4 py-2'>
								<textarea
									style={{ resize: 'none', height: '100px' }}
									maxLength={100}
									className='w-full bg-gray-50'
								></textarea>
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
