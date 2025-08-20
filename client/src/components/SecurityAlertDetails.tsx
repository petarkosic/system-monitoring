import { format } from 'date-fns';
import type { SecurityAlert } from '../types/alert';
import { BaseAlertDetails } from './BaseAlertDetails';

interface SecurityAlertDetailsProps {
	alert: SecurityAlert;
}

export const SecurityAlertDetails = ({ alert }: SecurityAlertDetailsProps) => {
	return (
		<BaseAlertDetails alert={alert} alertId={alert.id}>
			<div className='bg-gray-50 p-5 rounded-lg'>
				<h3 className='text-lg font-semibold mb-4'>Security Event Details</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>Event ID</h4>
						<p className='font-mono text-sm break-all'>
							{alert.payload.eventId}
						</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>
							Timestamp
						</h4>
						<p>{format(new Date(alert?.payload?.timestamp), 'PPpp')}</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>Type</h4>
						<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
							{alert.payload.type}
						</span>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>
							IP Address
						</h4>
						<p className='font-mono text-sm'>{alert.payload.ipAddress}</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>
							User Agent
						</h4>
						<p className='text-sm break-all'>{alert.payload.userAgent}</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>User ID</h4>
						<p>{alert.payload.userId}</p>
					</div>
				</div>

				{alert.payload.details &&
					Object.keys(alert.payload.details).length > 0 && (
						<div className='mt-6 pt-4 border-t border-gray-200'>
							<h4 className='text-md font-medium mb-3'>Threat Details</h4>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
								{Object.entries(alert.payload.details).map(([key, value]) => (
									<div key={key} className='bg-white p-3 rounded-md shadow-sm'>
										<h5 className='text-xs font-medium text-gray-500 mb-1 capitalize'>
											{key}
										</h5>
										<p className='text-sm break-all'>{value as string}</p>
									</div>
								))}
							</div>
						</div>
					)}
			</div>
		</BaseAlertDetails>
	);
};
