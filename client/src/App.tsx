import { Suspense } from 'react';
import { DashboardPage } from './pages/DashboardPage';

function App() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DashboardPage />
		</Suspense>
	);
}

export default App;
