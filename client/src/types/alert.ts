export interface Alert {
	id: string;
	ruleType: string;
	message: string;
	service: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
	status: AlertStatus;
	timestamp: string;
	assignedTo?: string;
	resolutionNotes?: string;
	payload: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export interface LogAlert extends Alert {
	payload: {
		id?: string;
		logId: string;
		timestamp: string;
		service: string;
		level: string;
		type?: string;
		message?: string;
		httpDetails?: {
			method: string;
			path: string;
			statusCode: number;
			responseTime: number;
			httpMessage: string;
		};
		createdAt?: string;
	};
}

export interface MetricAlert extends Alert {
	payload: {
		id?: string;
		metricId: string;
		timestamp: string;
		service: string;
		cpu: number;
		memory: number;
		baseMemory: number;
		memoryUnits: string;
		disk?: number;
		networkIn?: number;
		networkOut?: number;
	};
}

export interface SecurityAlert extends Alert {
	payload: {
		id?: string;
		eventId: string;
		timestamp: string;
		type?: string;
		severity?: string;
		service?: string;
		message?: string;
		ipAddress?: string;
		userAgent?: string;
		userId?: string;
		details?: Record<string, unknown>;
	};
}

export type AlertStatus =
	| 'ALL'
	| 'OPEN'
	| 'IN_PROGRESS'
	| 'RESOLVED'
	| 'DISMISSED';

export interface UpdateAlertDto {
	status?: AlertStatus;
	assignedTo?: string;
	resolutionNotes?: string;
}
