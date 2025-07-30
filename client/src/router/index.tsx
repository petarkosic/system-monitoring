import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardPage />,
	},
]);

export default router;
