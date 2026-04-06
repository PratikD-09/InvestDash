'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeals, setFilters, setPage } from '@/store/dealsSlice';
import { Loading, Card, Badge, Button, EmptyState, Input, Select } from '@/components/UI';
import { formatCurrency, formatPercent, getRiskColor, getRiskLabel } from '@/utils/theme';
import { useDebounce } from '@/hooks/useCustomHooks';
import Link from 'next/link';

export default function DealsPage() {
    const dispatch = useAppDispatch();
    const {
        deals,
        total,
        page,
        pageSize,
        totalPages,
        loading,
        filters,
        industries,
        stages,
    } = useAppSelector(state => state.deals);

    const [search, setSearch] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedStage, setSelectedStage] = useState('');
    const [minROI, setMinROI] = useState(0);
    const [maxROI, setMaxROI] = useState(100);
    const [minRisk, setMinRisk] = useState(0);
    const [maxRisk, setMaxRisk] = useState(100);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        dispatch(
            fetchDeals({
                search: debouncedSearch,
                industry: selectedIndustry || undefined,
                stage: selectedStage || undefined,
                minROI: minROI || undefined,
                maxROI: maxROI || undefined,
                minRisk: minRisk || undefined,
                maxRisk: maxRisk || undefined,
                page: 1,
                pageSize,
            })
        );
    }, [debouncedSearch, selectedIndustry, selectedStage, minROI, maxROI, minRisk, maxRisk, dispatch, pageSize]);

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
        dispatch(
            fetchDeals({
                search: debouncedSearch,
                industry: selectedIndustry || undefined,
                stage: selectedStage || undefined,
                minROI: minROI || undefined,
                maxROI: maxROI || undefined,
                minRisk: minRisk || undefined,
                maxRisk: maxRisk || undefined,
                page: newPage,
                pageSize,
            })
        );
    };

    const handleReset = () => {
        setSearch('');
        setSelectedIndustry('');
        setSelectedStage('');
        setMinROI(0);
        setMaxROI(100);
        setMinRisk(0);
        setMaxRisk(100);
    };



    return (
        <main className="min-h-screen p-6 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-7xl mx-auto m-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Deal Explorer</h1>
                    <p className="text-muted m-2">Discover and analyze investment opportunities</p>
                </div>

                {/* Filters */}
                <div className='m-2'>
                    <Card className="mb-8 p-6 m-">
                        <h3 className="font-semibold mb-4">Filters</h3>

                        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-3">
                            {/* Search */}
                            <div className="form-group">
                                <label className="text-sm font-semibold">Search</label>
                                <Input
                                    type="text"
                                    placeholder="Company name or description..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="border-border p-2"
                                />
                                {/* shadcn Input used for search filter */}
                            </div>

                            {/* Industry */}
                            <div className="form-group">
                                <label className="text-sm font-semibold">Industry</label>
                                <Select
                                    value={selectedIndustry}
                                    onChange={e => setSelectedIndustry(e.target.value)}
                                    className='p-2'
                                >
                                    <option value="">All Industries</option>
                                    {industries.map(ind => (
                                        <option key={ind} value={ind}>
                                            {ind}
                                        </option>
                                    ))}
                                </Select>
                                {/* shadcn Select used for industry filter */}
                            </div>

                            {/* Stage */}
                            <div className="form-group">
                                <label className="text-sm font-semibold">Stage</label>
                                <Select
                                    value={selectedStage}
                                    onChange={e => setSelectedStage(e.target.value)}
                                    className='p-2'
                                >
                                    <option value="">All Stages</option>
                                    {stages.map(stage => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </Select>
                                {/* shadcn Select used for stage filter */}
                            </div>

                            {/* Min ROI */}
                            <div className="form-group">
                                <label className="text-sm font-semibold">Min ROI: {minROI}%</label>
                                <input
                                    type="range"
                                    className="input p-2"
                                    min="0"
                                    max="100"
                                    value={minROI}
                                    onChange={e => setMinROI(Number(e.target.value))}
                                />
                            </div>

                            {/* Max ROI */}
                            <div className="form-group">
                                <label className="text-sm font-semibold">Max ROI: {maxROI}%</label>
                                <input
                                    type="range"
                                    className="input"
                                    min="0"
                                    max="100"
                                    value={maxROI}
                                    onChange={e => setMaxROI(Number(e.target.value))}
                                />
                            </div>

                            {/* Risk Control */}
                            <div className="form-group">
                                <label className="text-sm font-semibold">Risk Score</label>
                                <div className="flex gap-2">
                                    <Input
                                        //   type="number"
                                        placeholder="Min"
                                        className='p-2'
                                        min="0"
                                        max="100"
                                        value={minRisk}
                                        onChange={e => setMinRisk(Number(e.target.value))}
                                    />
                                    <Input
                                        //   type="number"
                                        placeholder="Max"
                                        className='p-2'
                                        min="0"
                                        max="100"
                                        value={maxRisk}
                                        onChange={e => setMaxRisk(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" className='p-2' onClick={handleReset}>
                                Reset Filters
                            </Button>
                        </div>
                    </Card>

                </div>


                {/* Deals List */}
                {loading ? (
                    <div className="flex-center py-12">
                        <Loading text="Loading deals..." />
                    </div>
                ) : deals.length === 0 ? (
                    <EmptyState
                        title="No deals found"
                        description="Try adjusting your filters to find more opportunities."
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            {deals.map(deal => (
                                <Link key={deal.id} href={`/deals/${deal.id}`}>
                                    <Card
                                    // key={deal.id}
                                    className="cursor-pointer transition m-2 !p-5 rounded-2xl hover:border-primary hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4">

                                        {/* 🔷 HEADER */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-lg">{deal.company}</h4>
                                                <p className="text-sm text-muted line-clamp-2 mt-1">
                                                    {deal.description}
                                                </p>
                                            </div>

                                            {/* ROI Highlight */}
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-success">{deal.roi}%</p>
                                                <p className="text-xs text-muted">Expected ROI</p>
                                            </div>
                                        </div>

                                        {/* 🔸 TAGS */}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="primary">{deal.stage}</Badge>
                                            <Badge variant="warning">{deal.industry}</Badge>
                                            <Badge variant="success">{deal.yearFounded}</Badge>
                                        </div>

                                        {/* 🔻 DIVIDER */}
                                        <div className="border-t border-[var(--border)]" />

                                        {/* 📊 METRICS */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                            {/* Risk */}
                                            <div>
                                                <p className="text-xs text-muted">Risk</p>
                                                <p className="font-semibold">
                                                    {getRiskLabel(deal.riskScore)}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {deal.riskScore} Score
                                                </p>
                                            </div>

                                            {/* Funding */}
                                            <div>
                                                <p className="text-xs text-muted">Target Raise</p>
                                                <p className="font-semibold">
                                                    {formatCurrency(deal.fundingTarget)}
                                                </p>
                                            </div>

                                            {/* Optional Extra Slot (future scalability) */}
                                            <div className="hidden md:block">
                                                <p className="text-xs text-muted">Status</p>
                                                <p className="font-semibold">Open</p>
                                            </div>

                                        </div>
                                    </div>
                                </Card>
                                
                                </Link>
                                
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8 p-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className='p-2'
                                >
                                    Previous
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Button
                                        key={p}
                                        size={'icon-lg'}
                                        variant={page === p ? 'primary' : 'secondary'}
                                        onClick={() => handlePageChange(p)}
                                        className={page === p ? 'p-2 m-2' : 'p-2 h-2 w-2'}

                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className='p-2'
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        <p className="text-center text-sm text-muted mt-6">
                            Showing {deals.length} of {total} deals
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}
