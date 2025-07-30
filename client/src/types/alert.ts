export interface Alert {
	id: string;
	ruleType: string;
	message: string;
	service: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
	status: AlertStatus;
	assignedTo?: string;
	resolutionNotes?: string;
	payload: Record<string, string>;
	createdAt: string;
	updatedAt: string;
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

export interface WebSocketAlert {
	id: string;
	ruleType: string;
	message: string;
	service: string;
	severity: string;
	status: string;
	timestamp: string;
	summary: string;
}
