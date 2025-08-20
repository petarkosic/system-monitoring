import { format } from 'date-fns';
import type { LogAlert } from '../types/alert';
import { BaseAlertDetails } from './BaseAlertDetails';

interface LogAlertDetailsProps {
	alert: LogAlert;
}

export const LogAlertDetails = ({ alert }: LogAlertDetailsProps) => {
	return (
		<BaseAlertDetails alert={alert} alertId={alert.id}>
			<div className='bg-gray-50 p-5 rounded-lg'>
				<h3 className='text-lg font-semibold mb-4'>Log Details</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>Log ID</h4>
						<p className='font-mono text-sm break-all'>{alert.payload.logId}</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>Level</h4>
						<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
							{alert.payload.level}
						</span>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>Type</h4>
						<p>{alert.payload.type}</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>
							Timestamp
						</h4>
						<p>{format(new Date(alert?.payload?.timestamp), 'PPpp')}</p>
					</div>
				</div>

				{alert.payload.httpDetails && (
					<div className='mt-6 pt-4 border-t border-gray-200'>
						<h4 className='text-md font-medium mb-3'>HTTP Details</h4>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3'>
							<div className='bg-white p-3 rounded-md shadow-sm'>
								<h5 className='text-xs font-medium text-gray-500 mb-1'>
									Method
								</h5>
								<p className='font-semibold'>
									{alert.payload.httpDetails.method || '-'}
								</p>
							</div>
							<div className='bg-white p-3 rounded-md shadow-sm'>
								<h5 className='text-xs font-medium text-gray-500 mb-1'>Path</h5>
								<p className='font-mono text-sm break-all'>
									{alert.payload.httpDetails.path || '-'}
								</p>
							</div>
							<div className='bg-white p-3 rounded-md shadow-sm'>
								<h5 className='text-xs font-medium text-gray-500 mb-1'>
									Status
								</h5>
								<span
									className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
										alert.payload.httpDetails.statusCode >= 400
											? 'bg-red-100 text-red-800'
											: alert.payload.httpDetails.statusCode >= 300
											? 'bg-yellow-100 text-yellow-800'
											: alert.payload.httpDetails.statusCode >= 200
											? 'bg-green-100 text-green-800'
											: ''
									}`}
								>
									{alert.payload.httpDetails.statusCode || '-'}
								</span>
							</div>
							<div className='bg-white p-3 rounded-md shadow-sm'>
								<h5 className='text-xs font-medium text-gray-500 mb-1'>
									Response Time
								</h5>
								<p>
									{alert.payload.httpDetails.responseTime
										? `${alert.payload.httpDetails.responseTime} ms`
										: '-'}
								</p>
							</div>
							<div className='bg-white p-3 rounded-md shadow-sm md:col-span-2 lg:col-span-1'>
								<h5 className='text-xs font-medium text-gray-500 mb-1'>
									Message
								</h5>
								<p>{alert.payload.httpDetails.httpMessage || '-'}</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</BaseAlertDetails>
	);
};
