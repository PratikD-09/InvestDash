'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDealById } from '@/store/dealsSlice';
import { Loading, Card, Badge, Button } from '@/components/UI';
import { formatCurrency, formatPercent, getRiskLabel, getRiskColor } from '@/utils/theme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RecommendationEngine } from '@/utils/recommendationEngine';
import Link from 'next/link';

export default function DealDetailsPage() {
    const params = useParams();
    const dealId = params.id as string;
    const dispatch = useAppDispatch();
    const { currentDeal: deal, loading } = useAppSelector(state => state.deals);

    useEffect(() => {
        dispatch(fetchDealById(dealId));
    }, [dealId, dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex-center">
                <Loading text="Loading deal details..." />
            </div>
        );
    }

    if (!deal) {
        return (
            <div className="min-h-screen flex-center">
                <Card>
                    <p className="text-lg">Deal not found</p>
                </Card>
            </div>
        );
    }

    const roiProjectionData = deal.roiProjection.map((value, index) => ({
        month: (index + 1) * 6,
        roi: value,
    }));

    return (
        <main className="min-h-screen p-6 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
            <div className=" mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href={'/deals'}>
                        <Button variant="secondary" className="mb-4 !p-3">
                            ← Back to Deals
                        </Button>
                    </Link>

                    <h1 className="text-4xl font-bold mb-4">{deal.company}</h1>
                    <div className="flex flex-wrap gap-3 p-2">
                        <Badge variant="primary">{deal.stage}</Badge>
                        <Badge variant="warning">{deal.industry}</Badge>
                        <Badge variant="success">Founded {deal.yearFounded}</Badge>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 !mb-8">
                    <Card>
                        <p className="text-sm text-muted mb-2">Expected ROI</p>
                        <h3 className="text-2xl font-bold ">{deal.roi}%</h3>
                    </Card>
                    <Card>
                        <p className="text-sm text-muted mb-2">Risk Score</p>
                        <h3 className="text-2xl font-bold ">{deal.riskScore}</h3>
                        {/* <p className="text-sm text-muted mt-1">{getRiskLabel(deal.riskScore)}</p> */}
                    </Card>
                    <Card>
                        <p className="text-sm text-muted mb-2">Target Raise</p>
                        <h3 className="text-2xl font-bold">{formatCurrency(deal.fundingTarget)}</h3>
                    </Card>
                    <Card>
                        <p className="text-sm text-muted mb-2">Valuation</p>
                        <h3 className="text-2xl font-bold">{formatCurrency(deal.valuation)}</h3>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 !mb-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 !space-y-6">
                        {/* Description */}
                        <Card>
                            <h3 className="font-semibold !mb-4">About</h3>
                            <p className="text-muted">{deal.description}</p>
                        </Card>

                        {/* Company Details */}
                        <Card>
                            <h3 className="font-semibold mb-4">Company Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted">Employees</p>
                                    <p className="font-semibold">{deal.employees}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Founded</p>
                                    <p className="font-semibold">{deal.yearFounded}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Investor Count</p>
                                    <p className="font-semibold">{deal.investorCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Months to Exit</p>
                                    <p className="font-semibold">{deal.monthsToExit}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Funding Details */}
                        <Card>
                            <h3 className="font-semibold mb-4">Funding Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted !mb-2">Raised vs Target</p>
                                    <div style={{
                                        backgroundColor: 'var(--border)',
                                        borderRadius: '0.5rem',
                                        height: '8px',
                                        overflow: 'hidden',
                                    }}>
                                        <div
                                            style={{
                                                backgroundColor: 'var(--success)',
                                                height: '100%',
                                                width: `${(deal.fundingRaised / deal.fundingTarget) * 100}%`,
                                                transition: 'width 0.3s ease',
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-muted">
                                        <span>{formatCurrency(deal.fundingRaised)} raised</span>
                                        <span>{formatCurrency(deal.fundingTarget)} target</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* ROI Projection Chart */}
                        <Card className="!p-5 rounded-2xl shadow-sm">

                            {/* 🔷 HEADER */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg">ROI Projection</h3>
                                <span className="text-xs text-muted">Monthly Trend</span>
                            </div>

                            {/* 🔻 DIVIDER */}
                            <div className="border-t border-[var(--border)] mb-4" />

                            {/* 📊 CHART */}
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={roiProjectionData}>

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
                                            label={{
                                                value: 'Months',
                                                position: 'insideBottomRight',
                                                offset: -5,
                                                style: { fontSize: 12, fill: 'var(--text-secondary)' }
                                            }}
                                        />

                                        {/* Y Axis */}
                                        <YAxis
                                            stroke="var(--text-secondary)"
                                            tickFormatter={(val) => `${val}%`}
                                            tick={{ fontSize: 12 }}
                                        />

                                        {/* Tooltip */}
                                        <Tooltip
                                            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                                            contentStyle={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '10px',
                                            }}
                                            formatter={(value) => [`${value}%`, 'ROI']}
                                        />

                                        {/* Legend */}
                                        <Legend
                                            wrapperStyle={{ fontSize: '13px' }}
                                            iconType="circle"
                                        />

                                        {/* Line */}
                                        <Line
                                            type="monotone"
                                            dataKey="roi"
                                            stroke="var(--success)"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: 'var(--success)' }}
                                            activeDot={{ r: 6 }}
                                            animationDuration={800}
                                        />

                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="!space-y-6">
                        {/* Financial Metrics */}
                        <Card>
                            <h3 className="font-semibold mb-4">Key Metrics</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <p className="text-sm text-muted">Metric 1</p>
                                    <p className="font-semibold">{deal.metric1}</p>
                                </div>
                                <div className="flex justify-between border-t border-border pt-3">
                                    <p className="text-sm text-muted">Metric 2</p>
                                    <p className="font-semibold">{deal.metric2}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Risk Assessment */}
                        <Card>
                            <h3 className="font-semibold mb-4">Risk Assessment</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted">Risk Level</p>
                                    <Badge variant={deal.riskScore >= 70 ? 'danger' : deal.riskScore >= 50 ? 'warning' : 'success'}>
                                        {getRiskLabel(deal.riskScore)}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <div style={{
                                        backgroundColor: 'var(--border)',
                                        borderRadius: '0.5rem',
                                        height: '8px',
                                        overflow: 'hidden',
                                    }}>
                                        <div
                                            style={{
                                                backgroundColor: getRiskColor(deal.riskScore, 'dark'),
                                                height: '100%',
                                                width: `${deal.riskScore}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-center gap-2 !space-y-2 ">
                            <Button variant="primary"  className="w-[200px] ">
                                Add to Interests
                            </Button>
                            <Button variant="secondary" className="w-[200px]">
                                Share Deal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
