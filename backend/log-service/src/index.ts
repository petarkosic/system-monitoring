import { config } from 'dotenv';
config();
import axios from 'axios';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const COLLECTOR_SERVICE_URL =
	process.env.COLLECTOR_SERVICE_URL || 'http://localhost:8080/api/logs';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.json()),
	transports: [new winston.transports.Console()],
});

const LOG_TEMPLATES = {
	'auth-service': {
		AUTH: [
			'Successful login for user admin@company.com from IP 192.168.1.105',
			'Failed authentication attempt for user jane.doe@company.com - invalid credentials',
			'Password reset token generated for user john.smith@company.com',
			'Session expired for user api-service@company.com after 30 minutes of inactivity',
			'JWT token validation failed: signature mismatch',
		],
		SECURITY: [
			'Multiple failed login attempts (5) from IP 203.0.113.22 - account temporarily locked',
			'Unauthorized access attempt to /admin/dashboard endpoint',
			'New admin user created with elevated privileges',
			'Security audit completed - 2 critical findings addressed',
			'Sensitive environment variable DB_PASSWORD accessed',
		],
	},
	'order-service': {
		PROCESSING: [
			'New order received: ORD-28463 with 5 items totaling $342.50',
			'Order ORD-29471 processed successfully - confirmation sent to customer',
			'Payment processed for order ORD-30145 via Stripe (txn_1Jp42ILzd2r4XyNv)',
			'Inventory reserved for order ORD-31289 - awaiting shipment',
			'Order ORD-28463 shipped via FedEx (tracking #798415632548)',
		],
		ERROR: [
			'Payment declined for order ORD-29752 - reason: insufficient funds',
			'Inventory shortage for product SKU-7582 - order ORD-30145 delayed',
			'Shipping address validation failed for order ORD-30567 - invalid postal code',
			'Duplicate order detected: ORD-29471 already exists in system',
			'Tax calculation error for international order ORD-30892',
		],
	},
	'inventory-service': {
		STOCK: [
			'Low stock alert: Product SKU-6842 (Wireless Headphones) - remaining: 3 units',
			'Inventory updated: Product SKU-7582 (Bluetooth Speaker) new quantity: 42',
			'Stock reconciliation completed - 2 discrepancies found in warehouse A',
			'Backorder created for Product SKU-9015 (Smart Watch) - quantity: 25',
			'Inventory snapshot generated for quarterly audit',
		],
		API: [
			'GET /api/v1/products/SKU-6842 - 200 - 142ms - Success',
			'POST /api/v1/inventory/adjustments - 201 - 78ms - Success',
			'PUT /api/v1/products/SKU-7582/stock - 400 - 241ms - Invalid quantity format',
			'GET /api/v1/inventory/report - 503 - 427ms - Database connection timeout',
			'DELETE /api/v1/products/SKU-9015 - 403 - 278ms - Insufficient permissions',
		],
	},
};

const SERVICE_NAMES = Object.keys(
	LOG_TEMPLATES
) as (keyof typeof LOG_TEMPLATES)[];

function generateRandomLog() {
	const service =
		SERVICE_NAMES[Math.floor(Math.random() * SERVICE_NAMES.length)];
	const logTypes = Object.keys(
		LOG_TEMPLATES[service]
	) as (keyof (typeof LOG_TEMPLATES)[typeof service])[];
	const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
	const templates = LOG_TEMPLATES[service][logType] as string[];
	const message = templates[Math.floor(Math.random() * templates.length)];

	let level = 'info';
	if (
		message.includes('failed') ||
		message.includes('error') ||
		message.includes('declined')
	) {
		level = 'error';
	} else if (
		message.includes('alert') ||
		message.includes('warning') ||
		message.includes('unauthorized')
	) {
		level = 'warn';
	}

	// Extract HTTP details if it's an API log
	let httpDetails = {};
	if (message.match(/(GET|POST|PUT|DELETE) .+ - \d{3}/)) {
		const parts = message.split(' - ');
		httpDetails = {
			method: parts[0].split(' ')[0],
			path: parts[0].split(' ')[1],
			statusCode: parseInt(parts[1]),
			responseTime: parts[2] ? parseInt(parts[2].replace('ms', '')) : undefined,
			httpMessage: parts[3],
		};
	}

	return {
		id: uuidv4(),
		timestamp: new Date().toISOString(),
		service,
		level,
		type: logType,
		message,
		...httpDetails,
	};
}

type Error = {
	message: string;
};

async function sendLogToCollector(log: any) {
	try {
		await axios.post(COLLECTOR_SERVICE_URL, log, {
			headers: { 'Content-Type': 'application/json' },
		});

		logger.info(`Log sent successfully: ${log.id}`);
	} catch (error) {
		const err = error as Error;
		logger.error(`Failed to send log: ${err.message}`);
	}
}

function startLogGeneration() {
	setTimeout(async () => {
		while (true) {
			const log = generateRandomLog();
			await sendLogToCollector(log);

			const delay = Math.random() * 2000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}, 5000);
}

startLogGeneration();
