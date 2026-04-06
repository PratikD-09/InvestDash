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
        <main className="min-h-screen !p-6 md:!p-8" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="!max-w-7xl mx-auto">
                <div className="!mb-8">
                    <h1 className="text-4xl font-bold !mb-2">Corporate Dashboard</h1>
                    <p className="text-muted">Investment portfolio and fundraising analytics</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 !mb-8">
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
                    <Card className="!p-5 rounded-2xl shadow-sm">

                        {/* 🔷 HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">
                                Investor Growth & Capital Trends
                            </h3>
                            <span className="text-xs text-muted">Monthly Overview</span>
                        </div>

                        {/* 🔻 DIVIDER */}
                        <div className="border-t border-[var(--border)] mb-4" />

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={investorGrowthData} barGap={10} barCategoryGap="20%">

                                {/* 🎨 GRADIENTS (same colors, improved look) */}
                                <defs>
                                    <linearGradient id="investorColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                                    </linearGradient>

                                    <linearGradient id="capitalColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--success)" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="var(--success)" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>

                                {/* Grid */}
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border)"
                                    opacity={0.3}
                                />

                                {/* X Axis */}
                                <XAxis
                                    dataKey="month"
                                    stroke="var(--text-secondary)"
                                    tick={{ fontSize: 12 }}
                                />

                                {/* Y Axis */}
                                <YAxis
                                    stroke="var(--text-secondary)"
                                    tick={{ fontSize: 12 }}
                                />

                                {/* Tooltip */}
                                <Tooltip
                                    cursor={false}
                                    contentStyle={{
                                        backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 85%, white)',
                                        border: '1px solid color-mix(in srgb, var(--border) 60%, white)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                    }}
                                    formatter={(value, name) => [
                                        name === "count" ? value : `${value}M`,
                                        name === "count" ? "Investors" : "Capital"
                                    ]}
                                />

                                {/* Legend */}
                                <Legend
                                    wrapperStyle={{ fontSize: '13px' }}
                                    iconType="circle"
                                />

                                {/* Bars */}
                                <Bar
                                    dataKey="count"
                                    fill="url(#investorColor)"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={800}
                                    name="Investors"
                                />

                                <Bar
                                    dataKey="capital"
                                    fill="url(#capitalColor)"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={800}
                                    name="Capital (M)"
                                />

                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Conversion Funnel */}
                    <div>
                        <Card className="!p-5 rounded-2xl shadow-sm">

                            {/* 🔷 HEADER */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg">Conversion Funnel</h3>
                                <span className="text-xs text-muted">Stage-wise Drop-off</span>
                            </div>

                            {/* 🔻 DIVIDER */}
                            <div className="border-t border-[var(--border)] mb-4" />

                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={conversionData}
                                    layout="vertical"
                                    margin={{ top: 10, right: 20, left: 40, bottom: 10 }} // ✅ important
                                >

                                    {/* Grid */}
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
                                        opacity={0.3}
                                    />

                                    {/* X Axis */}
                                    <XAxis
                                        type="number"
                                        stroke="var(--text-secondary)"
                                        tick={{ fontSize: 12 }}
                                    />

                                    {/* Y Axis (FIXED) */}
                                    <YAxis
                                        dataKey="stage"
                                        type="category"
                                        stroke="var(--text-secondary)"
                                        width={120} // ✅ prevents overlap
                                        tick={{ fontSize: 12 }}
                                    />

                                    {/* Tooltip */}
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        contentStyle={{
                                            backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 85%, white)',
                                            border: '1px solid color-mix(in srgb, var(--border) 60%, white)',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                        }}
                                    />

                                    {/* Bar */}
                                    <Bar
                                        dataKey="value"
                                        fill="var(--primary)"
                                        radius={[0, 6, 6, 0]} // rounded right side
                                        animationDuration={800}
                                    />

                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                </div>

                {/* Performance Radar */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <Card className="!p-5 rounded-2xl shadow-sm">

                        {/* 🔷 HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Performance Scorecard</h3>
                            <span className="text-xs text-muted">Multi-metric Analysis</span>
                        </div>

                        {/* 🔻 DIVIDER */}
                        <div className="border-t border-[var(--border)] mb-4" />

                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart data={performanceMetrics}>

                                {/* Grid */}
                                <PolarGrid stroke="var(--border)" opacity={0.4} />

                                {/* Angle Axis */}
                                <PolarAngleAxis
                                    dataKey="category"
                                    stroke="var(--text-secondary)"
                                    tick={{ fontSize: 12 }}
                                />

                                {/* Radius Axis */}
                                <PolarRadiusAxis
                                    stroke="var(--text-secondary)"
                                    tick={{ fontSize: 10 }}
                                />

                                {/* Radar */}
                                <Radar
                                    name="Performance Score"
                                    dataKey="value"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.25}
                                />

                                {/* Tooltip */}
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 85%, white)',
                                        border: '1px solid color-mix(in srgb, var(--border) 60%, white)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                    }}
                                    formatter={(value) => [`${value}`, "Score"]}
                                />

                            </RadarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Top Investors */}
                <Card>
                    <h3 className="font-semibold !mb-4">Top Investors by ROI</h3>
                    <div className="!space-y-3">
                        {[...investors]
                            .sort((a, b) => b.averageROI - a.averageROI)
                            .slice(0, 8)
                            .map(investor => (
                                <div
                                    key={investor.id}
                                    className="flex items-center justify-between !p-3 border rounded hover:bg-opacity-50 transition"
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
