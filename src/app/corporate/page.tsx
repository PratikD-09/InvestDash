'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInvestors } from '@/store/investorsSlice';
import { Loading, SummaryCard, Card, Badge } from '@/components/UI';
import { formatCurrency, formatPercent } from '@/utils/theme';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const investorGrowthData = [
  { quarter: 'Q1', count: 5, capital: 15 },
  { quarter: 'Q2', count: 8, capital: 25 },
  { quarter: 'Q3', count: 12, capital: 42 },
  { quarter: 'Q4', count: 15, capital: 70 },
];

const conversionData = [
  { stage: 'Prospect', value: 250 },
  { stage: 'Interested', value: 120 },
  { stage: 'Evaluation', value: 65 },
  { stage: 'Committed', value: 35 },
  { stage: 'Invested', value: 15 },
];

const performanceMetrics = [
  { category: 'Returns', value: 85 },
  { category: 'Diversification', value: 72 },
  { category: 'Risk Management', value: 65 },
  { category: 'Growth', value: 78 },
  { category: 'Exit Success', value: 80 },
];

export default function CorporateDashboardPage() {
  const dispatch = useAppDispatch();
  const { investors, loading } = useAppSelector(state => state.investors);

  useEffect(() => {
    dispatch(fetchInvestors({ pageSize: 20 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex-center">
        <Loading text="Loading corporate dashboard..." />
      </div>
    );
  }

  const totalCapitalRaised = investors.reduce((sum, inv) => sum + inv.totalInvestments, 0);
  const avgROI = investors.reduce((sum, inv) => sum + inv.averageROI, 0) / investors.length;
  const totalInvestorCount = investors.length;

  return (
    <main className="min-h-screen p-6 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Corporate Dashboard</h1>
          <p className="text-muted">Investment portfolio and fundraising analytics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Capital Raised"
            value={formatCurrency(totalCapitalRaised)}
            trend={18.5}
            color="primary"
          />
          <SummaryCard
            title="Active Investors"
            value={totalInvestorCount}
            trend={6.2}
            color="success"
          />
          <SummaryCard
            title="Portfolio ROI"
            value={formatPercent(avgROI)}
            trend={5.3}
            color="warning"
          />
          <SummaryCard
            title="Conversion Rate"
            value="6%"
            trend={2.1}
            color="success"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Investor Growth */}
          <Card>
            <h3 className="font-semibold mb-4">Investor Growth & Capital Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={investorGrowthData}>
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
                <Bar dataKey="count" fill="var(--primary)" name="Investors" />
                <Bar dataKey="capital" fill="var(--success)" name="Capital (M)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <h3 className="font-semibold mb-4">Conversion Funnel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="stage" type="category" stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Bar dataKey="value" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Performance Radar */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Performance Scorecard</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="category" stroke="var(--text-secondary)" />
                <PolarRadiusAxis stroke="var(--text-secondary)" />
                <Radar
                  name="Performance Score"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Investors */}
        <Card>
          <h3 className="font-semibold mb-4">Top Investors by ROI</h3>
          <div className="space-y-3">
            {[...investors]
              .sort((a, b) => b.averageROI - a.averageROI)
              .slice(0, 8)
              .map(investor => (
                <div
                  key={investor.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-opacity-50 transition"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {investor.avatar}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">{investor.name}</h5>
                      <p className="text-sm text-muted">{investor.portfolio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{investor.averageROI}% ROI</p>
                    <p className="text-sm text-muted">{investor.activeDealCount} deals</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
