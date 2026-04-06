'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchDeals,
  fetchDealStats,
  fetchIndustryDistribution,
  fetchIndustries,
  fetchStages,
} from '@/store/dealsSlice';
import { Loading, SummaryCard, Card, Badge } from '@/components/UI';
import { formatCurrency, formatPercent } from '@/utils/theme';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const investmentGrowthData = [
  { month: 'Jan', value: 2400 },
  { month: 'Feb', value: 3210 },
  { month: 'Mar', value: 4290 },
  { month: 'Apr', value: 5430 },
  { month: 'May', value: 6890 },
  { month: 'Jun', value: 8120 },
];

const colors = ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa'];

export default function Home() {
  const dispatch = useAppDispatch();
  const {
    deals,
    stats,
    industryDistribution,
    loading: dealsLoading,
  } = useAppSelector(state => state.deals);

  useEffect(() => {
    dispatch(fetchDeals({ page: 1, pageSize: 10 }));
    dispatch(fetchDealStats());
    dispatch(fetchIndustryDistribution());
    dispatch(fetchIndustries());
    dispatch(fetchStages());
  }, [dispatch]);

  if (dealsLoading) {
    return (
      <div className="min-h-screen flex-center">
        <Loading text="Loading dashboard..." />
      </div>
    );
  }

  const industryData = industryDistribution
    ? Object.entries(industryDistribution).map(([name, count]) => ({ name, value: count }))
    : [];

  const riskROIData = deals.slice(0, 8).map(deal => ({
    name: deal.company.substring(0, 10),
    risk: deal.riskScore,
    roi: deal.roi,
  }));

  return (
    <main className="min-h-screen p-6 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investor Dashboard</h1>
          <p className="text-muted">Your investment overview and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Investments"
            value={formatCurrency(stats?.totalFundingRaised || 0)}
            trend={12.5}
            color="primary"
          />
          <SummaryCard
            title="Active Deals"
            value={stats?.totalDeals || 0}
            trend={8.2}
            color="success"
          />
          <SummaryCard
            title="Average ROI"
            value={formatPercent(stats?.avgROI || 0)}
            trend={3.1}
            color="warning"
          />
          <SummaryCard
            title="Risk Score"
            value={formatPercent(stats?.avgRisk || 0)}
            trend={-2.4}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Investment Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={investmentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  dot={{ fill: 'var(--primary)' }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Industry Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Risk vs ROI Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Legend />
                <Bar dataKey="risk" fill="var(--danger)" />
                <Bar dataKey="roi" fill="var(--success)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h3 className="font-semibold mb-4">Featured Deals</h3>
          <div className="space-y-3">
            {deals.slice(0, 5).map(deal => (
              <div
                key={deal.id}
                className="flex items-center justify-between p-3 border border-transparent hover:border-opacity-50 rounded hover:bg-opacity-50 transition"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex-1">
                  <h5 className="font-semibold">{deal.company}</h5>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="primary" size="sm">
                      {deal.stage}
                    </Badge>
                    <Badge variant="warning" size="sm">
                      {deal.industry}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{deal.roi}% ROI</p>
                  <p className="text-sm text-muted">{deal.riskScore} Risk Score</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
