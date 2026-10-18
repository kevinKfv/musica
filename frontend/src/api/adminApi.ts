import { apiClient } from './apiClient';

export interface ModerationReport {
    id: string;
    reporterId: string;
    targetType: string;
    targetId: string;
    reason: string;
    status: string;
    resolutionNotes?: string;
    resolvedBy?: string;
    createdAt: string;
}

export const adminApi = {
    getPendingReports: () => 
        apiClient.get<ModerationReport[]>('/admin/reports').then(res => res.data),
        
    resolveReport: (reportId: string, data: { status: string; resolutionNotes: string }) => 
        apiClient.put<ModerationReport>(`/admin/reports/${reportId}/status`, data).then(res => res.data),
        
    getAnalytics: () => 
        apiClient.get<Record<string, number>>('/admin/analytics').then(res => res.data)
};
