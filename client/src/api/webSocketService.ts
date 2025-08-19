import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Alert } from '../types/alert';

let stompClient: Client | null = null;

export const connectWebSocket = (
	onMessageReceived: (alert: Alert) => void,
	onError?: (error: string) => void
) => {
	const socket = new SockJS('http://localhost:8083/alerts');

	stompClient = new Client({
		webSocketFactory: () => socket,
		reconnectDelay: 5000,
		heartbeatIncoming: 4000,
		heartbeatOutgoing: 4000,
	});

	stompClient.onConnect = () => {
		stompClient?.subscribe('/topic/alerts', (message) => {
			const alert: Alert = JSON.parse(message.body);
			onMessageReceived(alert);
		});
	};

	stompClient.onStompError = (frame) => {
		onError?.(frame.headers.message || 'Unknown WebSocket error');
	};

	stompClient.activate();

	return () => {
		stompClient?.deactivate();
	};
};
