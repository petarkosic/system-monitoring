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

type Error = {
	message: string;
};

interface Solution {
	id: string;
	alert_type: string;
	problem_pattern: string;
	solution_steps: string[];
	effectiveness_score: number;
	times_used: number;
}

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
	const [triedSolutions, setTriedSolutions] = useState<string[]>([]);
	const [solutions, setSolutions] = useState<Solution[]>([]);
	const [source, setSource] = useState<string>();
	const [selectedSolution, setSelectedSolution] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

	const handleAnalyzeAlert = async () => {
		setLoading(true);
		setIsSidebarOpen(true);

		try {
			const response = await fetch('http://localhost:8000/api/analyze-alert', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ alert, tried_solutions: triedSolutions }),
			});

			const data = await response.json();

			setSolutions(data.solutions);
			setSource(data.source);
		} catch (error) {
			const err = error as Error;
			console.error('Error analyzing alert:', err.message);
		} finally {
			setLoading(false);
		}
	};

	const retryAnalysis = async () => {
		const newTriedSolutions = [
			...triedSolutions,
			...solutions.map((s) => s.id),
		];

		setTriedSolutions(newTriedSolutions);
		setSolutions([]);

		await handleAnalyzeAlert();
	};

	const submitFeedback = async (solution: Solution, worked: boolean) => {
		try {
			await fetch('http://localhost:8000/api/record-feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					solution: solution,
					alert: alert,
					worked: worked,
					comments: worked
						? 'This solution worked'
						: 'This solution did not work',
				}),
			});

			if (worked) {
				setSelectedSolution(solution.id);
			}
		} catch (error) {
			console.error('Error submitting feedback:', error);
		}
	};

	return (
		<div className='container mx-auto p-4 font-sans relative'>
			<div
				className={`${
					isSidebarOpen ? 'mr-96' : ''
				} transition-margin duration-300`}
			>
				<div className='flex items-center justify-between mb-6'>
					<button
						className='flex items-center px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors cursor-pointer'
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

					<button
						className='flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer'
						onClick={handleAnalyzeAlert}
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
								d='M13 10V3L4 14h7v7l9-11h-7z'
							/>
						</svg>
						Analyze with AI
					</button>
				</div>

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
							<h3 className='text-sm font-medium text-gray-500 mb-1'>
								Service
							</h3>
							<p className='font-semibold'>{alert?.service}</p>
						</div>
						<div className='bg-gray-50 p-4 rounded-md'>
							<h3 className='text-sm font-medium text-gray-500 mb-1'>
								Message
							</h3>
							<p className='font-semibold'>{alert?.message}</p>
						</div>
						<div className='bg-gray-50 p-4 rounded-md'>
							<h3 className='text-sm font-medium text-gray-500 mb-1'>
								Event ID
							</h3>
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

			<div
				className={`fixed top-0 right-0 h-full w-126 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
					isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className='flex items-center justify-between p-4 border-b border-gray-200'>
					<h2 className='text-lg font-semibold text-gray-900'>AI Analysis</h2>
					<button
						onClick={() => setIsSidebarOpen(false)}
						className='p-1 rounded-md hover:bg-gray-100 transition-colors'
					>
						<svg
							className='w-5 h-5 text-gray-500'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				<div className='h-full overflow-y-auto p-4 bg'>
					{loading && (
						<div className='flex items-center justify-center py-8'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
							<span className='ml-3 text-gray-600'>
								Analyzing alert with AI...
							</span>
						</div>
					)}

					{!loading && solutions.length > 0 && (
						<div>
							<div className='mb-1 text-sm text-gray-600'>
								Solutions provided by:{' '}
								{source === 'knowledge_base' ? 'Knowledge Base' : 'AI Analysis'}
							</div>

							<div className='space-y-4'>
								{solutions.map((solution) => (
									<div
										key={solution.id}
										className='p-4 border rounded-lg border-black'
									>
										<h3 className='font-semibold mb-2 text-black'>
											{solution.problem_pattern}
										</h3>

										<div className='flex items-center mb-3'>
											<span className='text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full mr-2'>
												{solution.effectiveness_score}% effective
											</span>
											<span className='text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full'>
												Used {solution.times_used} times
											</span>
										</div>

										<div className='mb-3'>
											<h4 className='font-medium mb-1 text-black text-sm'>
												Solution Steps:
											</h4>
											<ol className='list-decimal list-inside space-y-1 text-sm'>
												{solution.solution_steps.map((step, index) => (
													<p key={index} className='text-gray-700'>
														{step}
													</p>
												))}
											</ol>
										</div>

										<div className='flex items-center gap-2'>
											<button
												onClick={() => submitFeedback(solution, true)}
												className={`px-3 py-1 text-sm rounded cursor-pointer ${
													selectedSolution === solution.id
														? 'bg-green-500 text-white'
														: 'bg-gray-200 text-gray-800 hover:bg-green-100'
												}`}
											>
												{selectedSolution === solution.id
													? '✓ Worked'
													: 'Mark as Worked'}
											</button>

											<button
												onClick={() => submitFeedback(solution, false)}
												className={`px-3 py-1 text-sm rounded cursor-pointer ${
													selectedSolution === solution.id
														? 'bg-red-500 text-white'
														: 'bg-gray-200 text-gray-800 hover:bg-red-100'
												}`}
											>
												Didn't Work
											</button>
										</div>
									</div>
								))}
							</div>

							<div className='mt-4 w-full mb-16'>
								<button
									onClick={retryAnalysis}
									className='w-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors'
								>
									Try Different Solutions
								</button>
							</div>
						</div>
					)}

					{!loading && solutions.length === 0 && (
						<div className='text-center py-8 text-gray-500'>
							<svg
								className='w-12 h-12 mx-auto text-gray-300 mb-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
								/>
							</svg>
							<p>Click "Analyze with AI" to get solutions for this alert</p>
						</div>
					)}
				</div>
			</div>

			{isSidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
					onClick={() => setIsSidebarOpen(false)}
				></div>
			)}
		</div>
	);
};
