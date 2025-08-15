import { config } from 'dotenv';
config();
import axios from 'axios';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const COLLECTOR_SERVICE_URL =
	process.env.COLLECTOR_SERVICE_URL || 'http://data-collector:8081/api/logs';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.json()),
	transports: [new winston.transports.Console()],
});

interface Log {
	logId: string;
	timestamp: string;
	service: string;
	level: string;
	type: string;
	message: string;
	method?: string;
	path?: string;
	statusCode?: number;
	responseTime?: number;
	httpMessage?: string;
}

const SERVICE_NAMES = [
	'auth-service',
	'order-service',
	'inventory-service',
	'payment-service',
	'notification-service',
];

const LOG_TYPES = ['INFO', 'ERROR', 'WARN', 'DEBUG'];

function generateRandomLog(): Log {
	const service = faker.helpers.arrayElement(SERVICE_NAMES);
	const type = faker.helpers.arrayElement(LOG_TYPES);

	let message = '';
	let httpDetails = {};

	if (faker.datatype.boolean()) {
		const method = faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']);
		const path = `/api/v1/${faker.helpers.slugify(
			faker.commerce.productName().toLowerCase()
		)}`;

		const statusGroups = [
			{
				codes: [200, 201],
				messages: ['OK', 'Success', 'Request successful', 'Created'],
			},
			{
				codes: [400],
				messages: ['Bad Request', 'Invalid input', 'Validation failed'],
			},
			{
				codes: [401],
				messages: ['Unauthorized', 'Authentication failed'],
			},
			{
				codes: [403],
				messages: ['Forbidden', 'Access denied'],
			},
			{
				codes: [404],
				messages: ['Not Found', 'Resource not found'],
			},
			{
				codes: [500, 503],
				messages: [
					'Server Error',
					'Internal Server Error',
					'Service Unavailable',
				],
			},
		];

		const statusGroup = faker.helpers.arrayElement(statusGroups);
		const statusCode = faker.helpers.arrayElement(statusGroup.codes);
		const httpMessage = faker.helpers.arrayElement(statusGroup.messages);
		const responseTime = faker.number.int({ min: 20, max: 500 });

		message = `${method} ${path} - ${statusCode} - ${responseTime}ms - ${httpMessage}`;
		httpDetails = { method, path, statusCode, responseTime, httpMessage };
	} else {
		// Non-HTTP logs
		message = faker.hacker.phrase();
	}

	const level =
		type === 'ERROR'
			? 'error'
			: type === 'WARN'
			? 'warn'
			: type === 'DEBUG'
			? 'debug'
			: 'info';

	return {
		logId: uuidv4(),
		timestamp: new Date().toISOString(),
		service,
		level,
		type,
		message,
		...httpDetails,
	};
}

type ErrorType = {
	message: string;
};

async function sendLogToCollector(log: Log) {
	try {
		await axios.post(COLLECTOR_SERVICE_URL, log, {
			headers: { 'Content-Type': 'application/json' },
		});
		logger.info(`Log sent successfully: ${log.logId}`);
	} catch (error) {
		const err = error as ErrorType;
		logger.error(`Failed to send log: ${err.message}`);
	}
}

function startLogGeneration() {
	setTimeout(async () => {
		while (true) {
			const log = generateRandomLog();
			await sendLogToCollector(log);

			const delay = faker.number.int({ min: 100, max: 2000 });
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}, 3000);
}

startLogGeneration();
