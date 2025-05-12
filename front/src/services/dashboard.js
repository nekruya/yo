import { api } from './axios';

// получить сводную статистику
export const fetchMetricsSummary = () => api.get('/metrics/summary'); 