import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveFilter } from '../features/alerts/alertsSlice';
import type { AlertStatus } from '../types/alert';

const statusFilters: Array<{ value: 'ALL' | AlertStatus; label: string }> = [
	{ value: 'ALL', label: 'All' },
	{ value: 'OPEN', label: 'Open' },
	{ value: 'IN_PROGRESS', label: 'In Progress' },
	{ value: 'RESOLVED', label: 'Resolved' },
	{ value: 'DISMISSED', label: 'Dismissed' },
];

export const FilterTabs = () => {
	const dispatch = useAppDispatch();
	const activeFilter = useAppSelector((state) => state.alerts.activeFilter);

	return (
		<div className='flex border-b border-gray-200 mb-4'>
			{statusFilters.map((filter) => (
				<button
					key={filter.value}
					onClick={() => dispatch(setActiveFilter(filter.value))}
					className={`px-4 py-2 font-medium text-sm focus:outline-none ${
						activeFilter === filter.value
							? 'border-b-2 border-blue-500 text-blue-600'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					{filter.label}
				</button>
			))}
		</div>
	);
};
