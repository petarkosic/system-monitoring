import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadInitialAlerts } from '../features/alerts/alertsThunks';
import { AlertCard } from '../components/AlertCard';
import { useWebSocket } from '../hooks/useWebSocket';
import { FilterTabs } from '../components/FilterTabs';

export const DashboardPage = () => {
	const dispatch = useAppDispatch();
	const { alerts, filters, activeFilter, loading, error } = useAppSelector(
		(state) => state.alerts
	);

	useWebSocket();

	useEffect(() => {
		dispatch(loadInitialAlerts());
	}, [dispatch, filters]);

	const filteredAlerts = alerts.filter(
		(alert) => activeFilter === 'ALL' || alert.status === activeFilter
	);

	if (loading) return <div className='p-4'>Loading alerts...</div>;
	if (error) return <div className='p-4 text-red-500'>Error: {error}</div>;

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-6'>Alerts Dashboard</h1>

			<FilterTabs />

			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<div className='lg:col-span-4'>
					<div className='mb-4'>
						<h2 className='font-semibold'>
							{filteredAlerts.length}{' '}
							{filteredAlerts.length === 1 ? 'Alert' : 'Alerts'}
						</h2>
					</div>

					<div className='space-y-4'>
						{filteredAlerts.map((alert) => (
							<AlertCard key={alert.id} alert={alert} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
