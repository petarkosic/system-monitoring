import { format } from 'date-fns';
import type { Alert } from '../types/alert';
import { Link } from 'react-router-dom';

const severityClasses = {
	CRITICAL: 'bg-red-50 border-red-500',
	HIGH: 'bg-orange-50 border-orange-500',
	MEDIUM: 'bg-yellow-50 border-yellow-500',
	LOW: 'bg-green-50 border-green-500',
};

const severityColors = {
	CRITICAL: 'text-red-500',
	HIGH: 'text-orange-500',
	MEDIUM: 'text-yellow-500',
	LOW: 'text-green-500',
};

interface AlertCardProps {
	alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
	if (!alert.id) return null;

	return (
		<div
			className={`p-4 mb-4 rounded-lg border-l-4 ${severityClasses[
				alert?.severity?.toUpperCase() as keyof typeof severityClasses
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

			<div className='flex flex-wrap items-center gap-2 mt-3'>
				<p className='text-black'>
					Severity:{' '}
					<span
						className={`font-bold ${severityColors[
							alert?.severity?.toUpperCase() as keyof typeof severityColors
						]!}`}
					>
						{alert?.severity?.toUpperCase()}
					</span>
				</p>
				<Link
					to={`/alerts/${alert.id}`}
					className={
						'ml-auto px-3 py-2 text-sm rounded bg-black border border-none hover:bg-gray-600 cursor-pointer'
					}
				>
					Read More &gt;
				</Link>
			</div>
		</div>
	);
};
