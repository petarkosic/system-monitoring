// BaseAlertDetails.tsx
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateAlertNoteThunk } from '../features/alert/alertThunks';
import { useNavigate } from 'react-router-dom';
import type { AlertStatus, Alert } from '../types/alert';
import { format } from 'date-fns';
import { updateAlertStatusThunk } from '../features/alerts/alertsThunks';

const severityClasses = {
	CRITICAL: 'bg-red-50 border-red-500 text-red-800',
	HIGH: 'bg-orange-50 border-orange-500 text-orange-800',
	MEDIUM: 'bg-yellow-50 border-yellow-500 text-yellow-800',
	LOW: 'bg-green-50 border-green-500 text-green-800',
};

const severityBadges = {
	CRITICAL: 'bg-red-100 text-red-800',
	HIGH: 'bg-orange-100 text-orange-800',
	MEDIUM: 'bg-yellow-100 text-yellow-800',
	LOW: 'bg-green-100 text-green-800',
};

const statusOptions: { value: AlertStatus; label: string }[] = [
	{ value: 'OPEN', label: 'Open' },
	{ value: 'IN_PROGRESS', label: 'In Progress' },
	{ value: 'RESOLVED', label: 'Resolved' },
	{ value: 'DISMISSED', label: 'Dismissed' },
];

interface BaseAlertDetailsProps {
	alert: Alert;
	alertId: string;
	children: React.ReactNode;
}

export const BaseAlertDetails = ({
	alert,
	alertId,
	children,
}: BaseAlertDetailsProps) => {
	const [note, setNote] = useState<string>('');
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleStatusChange = (newStatus: AlertStatus) => {
		dispatch(updateAlertStatusThunk(alert.id, newStatus));
		navigate(0);
	};

	const handleNoteSubmit = (note: string) => {
		dispatch(updateAlertNoteThunk(alert.id, note));
		navigate(0);
	};

	return (
		<div className='container mx-auto p-4 font-sans'>
			<button
				className='flex items-center px-4 py-2 mb-6 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors cursor-pointer'
				onClick={() => navigate(-1)}
			>
				<svg
					className='w-5 h-5 mr-2'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M10 19l-7-7m0 0l7-7m-7 7h18'
					/>
				</svg>
				Back to Alerts
			</button>

			<div
				className={`p-6 mb-6 rounded-lg border-l-4 ${
					severityClasses[
						alert?.severity?.toUpperCase() as keyof typeof severityClasses
					]
				}`}
			>
				<div className='flex flex-wrap items-center justify-between mb-6'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>
							Event ID: {alertId}
						</h1>
						<p className='text-sm text-gray-600 mt-1'>
							{format(new Date(alert?.createdAt || new Date()), 'PPpp')}
						</p>
					</div>
					<div className='flex items-center space-x-2 mt-2'>
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium ${
								severityBadges[
									alert?.severity?.toUpperCase() as keyof typeof severityBadges
								]
							}`}
						>
							{alert?.severity?.toUpperCase()}
						</span>
						<span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
							{alert?.status}
						</span>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
					<div className='bg-gray-50 p-4 rounded-md'>
						<h3 className='text-sm font-medium text-gray-500 mb-1'>
							Rule Type
						</h3>
						<p className='font-semibold'>{alert?.ruleType}</p>
					</div>
					<div className='bg-gray-50 p-4 rounded-md'>
						<h3 className='text-sm font-medium text-gray-500 mb-1'>Service</h3>
						<p className='font-semibold'>{alert?.service}</p>
					</div>
					<div className='bg-gray-50 p-4 rounded-md'>
						<h3 className='text-sm font-medium text-gray-500 mb-1'>Message</h3>
						<p className='font-semibold'>{alert?.message}</p>
					</div>
					<div className='bg-gray-50 p-4 rounded-md'>
						<h3 className='text-sm font-medium text-gray-500 mb-1'>Event ID</h3>
						<p className='font-mono text-sm'>{alert?.id}</p>
					</div>
				</div>

				<div className='mb-6'>{children}</div>

				<div className='mt-6 pt-6 border-t border-gray-200'>
					<h3 className='text-lg font-semibold mb-4'>Resolution Notes</h3>
					{alert?.resolutionNotes || alert?.status === 'DISMISSED' ? (
						<div className='p-4 bg-gray-100 rounded-md'>
							<p className='text-gray-800'>
								{alert?.resolutionNotes || 'No notes provided'}
							</p>
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
							className='space-y-4'
						>
							<textarea
								name='note'
								rows={4}
								value={note}
								onChange={(e) => setNote(e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								placeholder='Add resolution notes...'
							></textarea>
							<button
								type='submit'
								className='px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors'
							>
								Submit Note
							</button>
						</form>
					)}
				</div>

				<div className='flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200'>
					{statusOptions.map((option) => (
						<button
							key={option.value}
							onClick={() => handleStatusChange(option.value)}
							disabled={alert.status === option.value}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								alert.status === option.value
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer'
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
