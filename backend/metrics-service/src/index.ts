import { config } from 'dotenv';
config();
import axios from 'axios';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const COLLECTOR_SERVICE_URL =
	process.env.COLLECTOR_SERVICE_URL || 'http://localhost:8080/api/metrics';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.json()),
	transports: [new winston.transports.Console()],
});

interface Metric {
	metricId: string;
	timestamp: string;
	service: string;
	cpu: number;
	baseMemory: number;
	memory: number;
	memoryUnits: 'MB' | 'GB';
	disk?: number;
	networkIn?: number;
	networkOut?: number;
}

const SERVICES = [
	'auth-service',
	'payment-service',
	'order-service',
	'inventory-service',
	'user-service',
	'api-gateway',
	'database-primary',
	'redis-cache',
];

const SERVICE_PATTERNS: Record<
	string,
	{
		baseMemory: number;
		cpuRange: [number, number];
		diskRange?: [number, number];
		networkRange: [number, number];
	}
> = {
	'auth-service': {
		baseMemory: 512,
		cpuRange: [5, 30],
		networkRange: [100, 500],
	},
	'payment-service': {
		baseMemory: 768,
		cpuRange: [15, 40],
		networkRange: [200, 800],
	},
	'order-service': {
		baseMemory: 1024,
		cpuRange: [10, 35],
		networkRange: [150, 600],
	},
	'inventory-service': {
		baseMemory: 1024,
		cpuRange: [8, 25],
		networkRange: [100, 400],
	},
	'user-service': {
		baseMemory: 512,
		cpuRange: [5, 25],
		networkRange: [80, 300],
	},
	'api-gateway': {
		baseMemory: 1024,
		cpuRange: [20, 60],
		networkRange: [500, 2000],
	},
	'database-primary': {
		baseMemory: 2048,
		cpuRange: [30, 80],
		diskRange: [75, 95],
		networkRange: [300, 1000],
	},
	'redis-cache': {
		baseMemory: 1024,
		cpuRange: [20, 50],
		diskRange: [60, 85],
		networkRange: [400, 1500],
	},
};

function generateMetric(): Metric {
	const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
	const pattern = SERVICE_PATTERNS[service];

	const cpu = Math.floor(
		Math.random() * (pattern.cpuRange[1] - pattern.cpuRange[0]) +
			pattern.cpuRange[0]
	);

	const memory = pattern.baseMemory + Math.floor(Math.random() * 512);

	const networkIn = Math.floor(
		Math.random() * (pattern.networkRange[1] - pattern.networkRange[0]) +
			pattern.networkRange[0]
	);

	const networkOut = Math.floor(networkIn * (0.7 + Math.random() * 0.3));

	return {
		metricId: uuidv4(),
		timestamp: new Date().toISOString(),
		service,
		cpu,
		baseMemory: pattern.baseMemory,
		memory,
		memoryUnits: 'MB',
		disk: pattern.diskRange
			? Math.floor(
					Math.random() * (pattern.diskRange[1] - pattern.diskRange[0]) +
						pattern.diskRange[0]
			  )
			: Math.floor(Math.random() * 40 + 20),
		networkIn,
		networkOut,
	};
}

type Error = {
	message: string;
};

async function sendMetricToCollector(metric: Metric) {
	try {
		await axios.post(COLLECTOR_SERVICE_URL, metric, {
			headers: { 'Content-Type': 'application/json' },
		});

		logger.info(`Metric sent successfully: ${metric.metricId}`);
	} catch (error) {
		const err = error as Error;
		logger.error(`Failed to send metric: ${err.message}`);
	}
}

function startMetricGeneration() {
	setTimeout(async () => {
		while (true) {
			const metric = generateMetric();
			await sendMetricToCollector(metric);

			const delay = Math.random() * 2000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}, 5000);
}

startMetricGeneration();
