import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { AlertPage } from '../pages/AlertPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardPage />,
	},
	{
		path: '/alerts/:id',
		element: <AlertPage />,
	},
]);

export default router;
