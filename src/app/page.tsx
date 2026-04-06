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
          <p className="text-muted m-2">Your investment overview and analytics</p>
        </div>

        <div className="grid grid-cols-2 m-4 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 m-4 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Investment Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={investmentGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="var(--text-secondary)"
                    tickFormatter={(value) => `$${value}`}
                  />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                  }}
                  formatter={(value) => [`₹${value}`, "Investment"]}
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
                  label={false}
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={4}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 85%, white)',
                    border: '1px solid color-mix(in srgb, var(--border) 60%, white)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 m-4 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Risk vs ROI Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <defs>
                  <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--danger)" stopOpacity={0.4} />
                  </linearGradient>

                  <linearGradient id="roiColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 12 }}
                />

                {/* Y Axis */}
                <YAxis
                  stroke="var(--text-secondary)"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 85%, white)',
                    border: '1px solid color-mix(in srgb, var(--border) 60%, white)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '13px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="risk"
                  fill="url(#riskColor)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />

                <Bar
                  dataKey="roi"
                  fill="url(#roiColor)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className='m-4'>
          <Card>
            <h3 className="font-semibold mb-4">Featured Deals</h3>
            <div className="space-y-3">
              {deals.slice(0, 5).map(deal => (
                <div
                  key={deal.id}
                  className="flex m-2 p-2 items-center justify-between p-3 border border-transparent hover:border-opacity-50 rounded hover:bg-opacity-50 transition"
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

      </div>
    </main>
  );
}
