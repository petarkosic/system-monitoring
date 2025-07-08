import { config } from 'dotenv';
config();
import axios from 'axios';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const COLLECTOR_SERVICE_URL =
	process.env.COLLECTOR_SERVICE_URL ||
	'http://localhost:8080/api/security-events';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.json()),
	transports: [new winston.transports.Console()],
});

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEvent {
	id: string;
	timestamp: string;
	type:
		| 'authentication'
		| 'authorization'
		| 'configuration'
		| 'data_access'
		| 'threat';
	severity: Severity;
	service: string;
	message: string;
	ipAddress?: string;
	userAgent?: string;
	userId?: string;
	details?: Record<string, unknown>;
}

const SECURITY_EVENTS = [
	{
		type: 'authentication' as const,
		messages: [
			'Multiple failed login attempts for user {userId} from IP {ip} - account temporarily locked',
			'Successful login for {userId} from new device ({deviceType}) in {location}',
			'Password change detected for privileged account {userId}',
			'User account {userId} locked due to suspicious activity patterns',
			'MFA bypass attempt detected for {userId} using {method}',
		],
		severity: ['medium', 'high' as const],
		services: ['auth-service', 'api-gateway'],
	},
	{
		type: 'authorization' as const,
		messages: [
			'Unauthorized access attempt to {endpoint} by {userId} from IP {ip}',
			'Role escalation attempt detected - user {userId} tried to assign admin privileges',
			'API key rotation required for service account {serviceAccount}',
			'Expired token used for access to {endpoint}',
			"Privileged operation '{operation}' performed by {userId}",
		],
		severity: ['medium', 'high' as const],
		services: ['auth-service', 'api-gateway', 'admin-service'],
	},
	{
		type: 'configuration' as const,
		messages: [
			"Security policy '{policyName}' modified by {userId}",
			"New admin user '{username}' created with elevated privileges",
			'Firewall rules updated - {count} new rules added',
			"Sensitive environment variable '{envVar}' accessed by {service}",
			"CORS policy modified to allow origin '{origin}'",
		],
		severity: ['low', 'medium' as const],
		services: ['auth-service', 'admin-service', 'config-service'],
	},
	{
		type: 'data_access' as const,
		messages: [
			'Bulk data export initiated by {userId} - {count} records exported',
			'Sensitive customer data accessed by {userId} without proper authorization',
			'Unusual data access pattern detected for user {userId} - {count} queries in {minutes} minutes',
			'Database backup downloaded to IP {ip}',
			'GDPR data deletion request processed for user {email}',
		],
		severity: ['medium', 'high' as const],
		services: ['user-service', 'database-service', 'compliance-service'],
	},
	{
		type: 'threat' as const,
		messages: [
			'Brute force attack detected from IP {ip} - {count} attempts blocked',
			"SQL injection attempt blocked in {service}: '{maliciousPayload}'",
			"XSS payload detected in request to {endpoint}: '{payload}'",
			'Known malicious IP address {ip} blocked - associated with {threatType}',
			'Credential stuffing attempt detected using {count} stolen credentials',
		],
		severity: ['high', 'CRITICAL' as const],
		services: ['api-gateway', 'waf-service', 'ids-service'],
	},
];

const USER_IDS = ['admin', 'jane.doe', 'john.smith', 'svc-api', 'audit-user'];

const SERVICE_ACCOUNTS = [
	'ci-cd-pipeline',
	'backup-service',
	'monitoring-system',
];

const DEVICE_TYPES = [
	'iPhone',
	'Android',
	'Windows PC',
	'MacBook Pro',
	'Linux Desktop',
];

const MALICIOUS_PAYLOADS = [
	"' OR 1=1--",
	"<script>alert('xss')</script>",
	'| ls -la',
	'../etc/passwd',
	"{'$ne': null}",
];

const THREAT_TYPES = ['botnet', 'phishing', 'scanner', 'command-and-control'];

function generateSecurityEvent(): SecurityEvent {
	const eventType =
		SECURITY_EVENTS[Math.floor(Math.random() * SECURITY_EVENTS.length)];
	const severity =
		eventType.severity[Math.floor(Math.random() * eventType.severity.length)];

	const template =
		eventType.messages[Math.floor(Math.random() * eventType.messages.length)];

	const placeholders: Record<string, string> = {
		userId: USER_IDS[Math.floor(Math.random() * USER_IDS.length)],
		ip: generateIP(),
		deviceType: DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)],
		location: `${generateCity()}, ${generateCountry()}`,
		method: ['SMS', 'Email', 'TOTP'][Math.floor(Math.random() * 3)],
		endpoint: [
			'/admin/dashboard',
			'/api/users',
			'/payment/process',
			'/config/security',
			'/database/export',
		][Math.floor(Math.random() * 5)],
		serviceAccount:
			SERVICE_ACCOUNTS[Math.floor(Math.random() * SERVICE_ACCOUNTS.length)],
		operation: [
			'user.delete',
			'config.update',
			'role.modify',
			'audit.clear',
			'secret.rotate',
		][Math.floor(Math.random() * 5)],
		policyName: [
			'PasswordComplexity',
			'SessionTimeout',
			'MFARequired',
			'APIRateLimit',
			'DataRetention',
		][Math.floor(Math.random() * 5)],
		username: `admin-${Math.floor(Math.random() * 100)}`,
		count: Math.floor(Math.random() * 1000 + 10).toString(),
		envVar: [
			'DB_PASSWORD',
			'API_SECRET',
			'JWT_KEY',
			'ENCRYPTION_KEY',
			'S3_ACCESS_KEY',
		][Math.floor(Math.random() * 5)],
		service: [
			'auth-service',
			'payment-service',
			'user-service',
			'config-service',
		][Math.floor(Math.random() * 4)],
		origin: [
			'https://external-app.com',
			'http://localhost:3000',
			'https://partner-domain.net',
			'http://192.168.1.100',
		][Math.floor(Math.random() * 4)],
		email: [
			'user@example.com',
			'customer@domain.com',
			'admin@company.com',
			'test@test.org',
		][Math.floor(Math.random() * 4)],
		minutes: Math.floor(Math.random() * 60 + 5).toString(),
		maliciousPayload:
			MALICIOUS_PAYLOADS[Math.floor(Math.random() * MALICIOUS_PAYLOADS.length)],
		payload: "<script>fetch('/steal-cookie')</script>",
		threatType: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
	};

	let message = template;
	for (const [key, value] of Object.entries(placeholders)) {
		message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
	}

	return {
		id: uuidv4(),
		timestamp: new Date().toISOString(),
		type: eventType.type,
		severity: severity as Severity,
		service:
			eventType.services[Math.floor(Math.random() * eventType.services.length)],
		message,
		ipAddress: placeholders.ip,
		userAgent: generateUserAgent(),
		userId: placeholders.userId,
		details: {
			requestId: uuidv4(),
			location: placeholders.location,
			threatScore: Math.floor(Math.random() * 100),
		},
	};
}

function generateIP(): string {
	return `${Math.floor(Math.random() * 255)}.${Math.floor(
		Math.random() * 255
	)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateUserAgent(): string {
	const agents = [
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
		'PostmanRuntime/7.28.4',
		'curl/7.68.0',
		'python-requests/2.26.0',
		'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
	];

	return agents[Math.floor(Math.random() * agents.length)];
}

function generateCountry(): string {
	const countries = [
		'United States',
		'United Kingdom',
		'Germany',
		'Japan',
		'Brazil',
		'Australia',
		'India',
		'Canada',
	];

	return countries[Math.floor(Math.random() * countries.length)];
}

function generateCity(): string {
	const cities = [
		'New York',
		'London',
		'Berlin',
		'Tokyo',
		'São Paulo',
		'Sydney',
		'Mumbai',
		'Toronto',
	];

	return cities[Math.floor(Math.random() * cities.length)];
}

type Error = {
	message: string;
};

async function sendEventToCollector(event: SecurityEvent) {
	try {
		await axios.post(COLLECTOR_SERVICE_URL, event, {
			headers: { 'Content-Type': 'application/json' },
		});

		logger.info(`Security event sent successfully: ${event.id}`);
	} catch (error) {
		const err = error as Error;
		logger.error(`Failed to send security event: ${err.message}`);
	}
}

function startEventGeneration() {
	setTimeout(async () => {
		while (true) {
			const event = generateSecurityEvent();
			await sendEventToCollector(event);

			const delay = Math.random() * 2000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}, 5000);
}

startEventGeneration();
