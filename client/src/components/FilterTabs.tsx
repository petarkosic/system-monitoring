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
	const { activeFilter } = useAppSelector((state) => state.alerts);

	return (
		<div className='flex items-center rounded-lg p-1'>
			{statusFilters.map((filter, index) => (
				<div
					className='mb-8 p-1 flex items-center rounded-lg'
					key={filter.value}
				>
					<button
						key={filter.value}
						onClick={() => dispatch(setActiveFilter(filter.value))}
						className={`px-12 py-12 font-medium text-sm text-blue-600 shadow-sm cursor-pointer focus:outline-none ${
							activeFilter === filter.value
								? 'border-b-2 border-blue-500 text-blue-600'
								: 'text-gray-500 hover:text-gray-700'
						}`}
					>
						{filter.label}
					</button>

					{index !== statusFilters.length - 1 && (
						<div className='h-10 w-px bg-gray-700 mx-1'></div>
					)}
				</div>
			))}
		</div>
	);
};
