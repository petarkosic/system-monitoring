import { format } from 'date-fns';
import type { MetricAlert } from '../types/alert';
import { BaseAlertDetails } from './BaseAlertDetails';

interface MetricAlertDetailsProps {
	alert: MetricAlert;
}

export const MetricAlertDetails = ({ alert }: MetricAlertDetailsProps) => {
	const totalMemoryPercent = Math.round(
		(alert.payload.memory / alert.payload.baseMemory) * 100
	);
	const isMemoryOverflow = alert.payload.memory > alert.payload.baseMemory;
	const baseMemoryPercent = Math.min(totalMemoryPercent, 100);
	const overflowPercent = isMemoryOverflow ? totalMemoryPercent - 100 : 0;
	const totalBarPercent = Math.min(totalMemoryPercent, 200); // cap at 200% for visual display
	const emptyBarPercent = 200 - totalBarPercent; // remaining empty space

	return (
		<BaseAlertDetails alert={alert} alertId={alert.id}>
			<div className='bg-gray-50 p-5 rounded-lg'>
				<h3 className='text-lg font-semibold mb-4'>Metric Details</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>
							Metric ID
						</h4>
						<p className='font-mono text-sm break-all'>
							{alert.payload.metricId}
						</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500 mb-1'>
							Timestamp
						</h4>
						<p>{format(new Date(alert?.payload?.timestamp), 'PPpp')}</p>
					</div>
				</div>

				<div className='mt-6 pt-4 border-t border-gray-200'>
					<h4 className='text-md font-medium mb-3'>Resource Usage</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div className='bg-white p-4 rounded-md shadow-sm'>
							<h5 className='text-xs font-medium text-gray-500 mb-2'>
								CPU Usage
							</h5>
							<div className='flex items-center'>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className='bg-blue-600 h-2.5 rounded-full'
										style={{ width: `${alert.payload.cpu}%` }}
									></div>
								</div>
								<span className='ml-2 text-sm font-medium'>
									{alert.payload.cpu}%
								</span>
							</div>
						</div>

						<div className='bg-white p-4 rounded-md shadow-sm'>
							<h5 className='text-xs font-medium text-gray-500 mb-2'>
								Memory Usage
							</h5>

							<div className='flex w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
								<div
									className='h-2.5 bg-blue-600'
									style={{ width: `${baseMemoryPercent / 2}%` }}
								></div>

								{isMemoryOverflow && (
									<div
										className='h-2.5 bg-red-600'
										style={{ width: `${overflowPercent / 2}%` }}
									></div>
								)}

								<div
									className='h-2.5 bg-gray-200 flex-grow'
									style={{ width: `${emptyBarPercent / 2}%` }}
								></div>
							</div>

							<div className='relative -mt-2.5 mb-2'>
								<div
									className='absolute h-3 border-r-2 border-white border-dashed'
									style={{ left: '50%' }}
								></div>
								<div
									className='absolute text-xs text-gray-500 -top-4'
									style={{ left: '50%', transform: 'translateX(-50%)' }}
								>
									100%
								</div>
							</div>

							<div className='flex items-center justify-between mt-1'>
								<span className='text-sm font-medium'>
									{alert.payload.memory}/{alert.payload.baseMemory}{' '}
									{alert.payload.memoryUnits}
									{isMemoryOverflow && (
										<span className='text-red-600 ml-1'>
											(+{alert.payload.memory - alert.payload.baseMemory})
										</span>
									)}
								</span>

								<span className='text-xs text-gray-500'>
									{totalMemoryPercent}%
									{isMemoryOverflow && ` (${overflowPercent}% overflow)`}
								</span>
							</div>

							<div className='flex flex-wrap gap-3 items-center text-xs text-gray-500 mt-2'>
								<div className='flex items-center'>
									<div className='w-3 h-3 bg-blue-600 mr-1 rounded-sm'></div>
									<span>Base Memory</span>
								</div>
								{isMemoryOverflow && (
									<div className='flex items-center'>
										<div className='w-3 h-3 bg-red-600 mr-1 rounded-sm'></div>
										<span>Overflow Memory</span>
									</div>
								)}
							</div>

							{isMemoryOverflow && (
								<p className='text-xs text-red-600 mt-2 font-medium'>
									⚠️ Memory exceeded allocation by{' '}
									{alert.payload.memory - alert.payload.baseMemory}{' '}
									{alert.payload.memoryUnits}
								</p>
							)}
						</div>

						<div className='bg-white p-4 rounded-md shadow-sm'>
							<h5 className='text-xs font-medium text-gray-500 mb-2'>
								Disk Usage
							</h5>
							<div className='flex items-center'>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className='bg-purple-600 h-2.5 rounded-full'
										style={{ width: `${alert.payload.disk}%` }}
									></div>
								</div>
								<span className='ml-2 text-sm font-medium'>
									{alert.payload.disk}%
								</span>
							</div>
						</div>

						<div className='bg-white p-4 rounded-md shadow-sm'>
							<h5 className='text-xs font-medium text-gray-500 mb-2'>
								Network
							</h5>
							<div className='space-y-1'>
								<div className='flex justify-between text-sm'>
									<span>In:</span>
									<span className='font-medium'>
										{alert.payload.networkIn}MB
									</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span>Out:</span>
									<span className='font-medium'>
										{alert.payload.networkOut}MB
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BaseAlertDetails>
	);
};
