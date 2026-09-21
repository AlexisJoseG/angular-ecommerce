export interface AppError {
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
