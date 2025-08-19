import { config } from 'dotenv';
config();
import axios from 'axios';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const COLLECTOR_SERVICE_URL =
	process.env.COLLECTOR_SERVICE_URL ||
	'http://data-collector:8081/api/security-events';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.json()),
	transports: [new winston.transports.Console()],
});

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface SecurityEvent {
	eventId: string;
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
			'Biometric login attempt failed for {userId} from {location}',
			'Unrecognized browser login detected for {userId} from {ip}',
		],
		severity: ['MEDIUM', 'HIGH' as const],
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
			'OAuth token misuse detected for {userId}',
			'Access to restricted report {reportName} denied for {userId}',
		],
		severity: ['MEDIUM', 'HIGH' as const],
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
			'SSL certificate for {domain} expired',
			'DNS settings changed for {domain} by {userId}',
		],
		severity: ['LOW', 'MEDIUM' as const],
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
			'HIPAA-protected data accessed by {userId} from {location}',
			'Large file transfer to external IP {ip} detected',
		],
		severity: ['MEDIUM', 'HIGh' as const],
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
			'DDoS attack detected targeting {service} - {count} requests per second',
			'Ransomware signature detected in uploaded file by {userId}',
		],
		severity: ['HIGH', 'CRITICAL' as const],
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
const DOMAINS = ['example.com', 'mycompany.com', 'secureapp.net'];
const REPORT_NAMES = ['FinancialSummary', 'UserAudit', 'VulnerabilityReport'];

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
		count: Math.floor(Math.random() * 10000).toString(),
		minutes: Math.floor(Math.random() * 60 + 1).toString(),
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
		maliciousPayload:
			MALICIOUS_PAYLOADS[Math.floor(Math.random() * MALICIOUS_PAYLOADS.length)],
		payload: "<script>fetch('/steal-cookie')</script>",
		threatType: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
		domain: DOMAINS[Math.floor(Math.random() * DOMAINS.length)],
		reportName: REPORT_NAMES[Math.floor(Math.random() * REPORT_NAMES.length)],
	};

	let message = template;
	for (const [key, value] of Object.entries(placeholders)) {
		message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
	}

	return {
		eventId: uuidv4(),
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
			sessionId: uuidv4(),
			sourcePort: Math.floor(Math.random() * 65535),
			destinationPort: Math.floor(Math.random() * 65535),
			bytesTransferred: Math.floor(Math.random() * 1000000),
			fileHash: uuidv4().replace(/-/g, ''),
			deviceType: placeholders.deviceType,
			method: placeholders.method,
			endpoint: placeholders.endpoint,
			serviceAccount: placeholders.serviceAccount,
			operation: placeholders.operation,
			policyName: placeholders.policyName,
			username: placeholders.username,
			envVar: placeholders.envVar,
			service: placeholders.service,
			origin: placeholders.origin,
			email: placeholders.email,
			maliciousPayload: placeholders.maliciousPayload,
			payload: placeholders.payload,
			threatType: placeholders.threatType,
			domain: placeholders.domain,
			reportName: placeholders.reportName,
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
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
		'PostmanRuntime/7.28.4',
		'curl/7.68.0',
		'python-requests/2.26.0',
		'Mozilla/5.0 (compatible; Googlebot/2.1)',
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

type Error = { message: string };

async function sendEventToCollector(event: SecurityEvent) {
	try {
		await axios.post(COLLECTOR_SERVICE_URL, event, {
			headers: { 'Content-Type': 'application/json' },
		});
		logger.info(`Security event sent successfully: ${event.eventId}`);
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
