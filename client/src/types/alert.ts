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
