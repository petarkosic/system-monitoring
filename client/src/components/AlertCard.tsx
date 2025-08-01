import { format } from 'date-fns';
import { useAppDispatch } from '../store/hooks';
import { updateAlertStatusThunk } from '../features/alerts/alertsThunks';
import type { Alert, AlertStatus } from '../types/alert';

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

interface AlertCardProps {
	alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
	const dispatch = useAppDispatch();

	const handleStatusChange = (newStatus: AlertStatus) => {
		dispatch(
			updateAlertStatusThunk(alert.id, {
				status: newStatus,
				assignedTo: '',
				resolutionNotes: '',
			})
		);
	};

	if (!alert.id) return null;

	return (
		<div
			className={`p-4 mb-4 rounded-lg border-l-4 ${severityClasses[
				alert.severity.toUpperCase() as keyof typeof severityClasses
			]!}`}
		>
			<div className='flex justify-between items-start'>
				<div>
					<h3 className='font-bold text-gray-900 text-lg'>
						{alert.ruleType} in {alert.service}
					</h3>
					<p className='text-sm text-gray-600'>
						{format(new Date(alert.createdAt), 'PPpp')}
					</p>
				</div>
				<span
					className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800
							${
								alert.status === 'IN_PROGRESS'
									? 'bg-purple-100 text-purple-800'
									: alert.status === 'RESOLVED'
									? 'bg-green-100 text-green-800'
									: alert.status === 'DISMISSED'
									? 'bg-red-100 text-red-800'
									: ''
							}`}
				>
					{alert.status ?? 'OPEN'}
				</span>
			</div>

			<p className='my-2 text-gray-900'>{alert.message}</p>

			<div className='flex flex-wrap gap-2 mt-3'>
				{statusOptions.map((option) => (
					<button
						key={option.value}
						onClick={() => handleStatusChange(option.value)}
						disabled={alert.status === option.value}
						className={`px-3 py-1 text-sm rounded ${
							alert.status === option.value
								? 'text-gray-500 !border-none !cursor-not-allowed'
								: 'bg-white border border-gray-300 hover:bg-gray-50'
						}`}
					>
						{option.label}
					</button>
				))}
			</div>
		</div>
	);
};
