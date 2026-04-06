export const colors = {
  light: {
    bg: '#f8f9fa',
    bgSecondary: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  dark: {
    bg: '#0f172a',
    bgSecondary: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    border: '#334155',
    primary: '#60a5fa',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
  },
};

export const getRiskColor = (risk: number, theme: 'light' | 'dark'): string => {
  if (risk >= 70) return theme === 'light' ? '#ef4444' : '#f87171';
  if (risk >= 50) return theme === 'light' ? '#f59e0b' : '#fbbf24';
  return theme === 'light' ? '#10b981' : '#34d399';
};

export const getRiskLabel = (risk: number): string => {
  if (risk >= 70) return 'High Risk';
  if (risk >= 50) return 'Medium Risk';
  return 'Low Risk';
};

export const getROIColor = (roi: number): string => {
  if (roi >= 50) return '#10b981';
  if (roi >= 30) return '#3b82f6';
  if (roi >= 20) return '#f59e0b';
  return '#ef4444';
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${Math.round(value * 10) / 10}%`;
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
