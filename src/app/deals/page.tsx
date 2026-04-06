'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeals, setFilters, setPage } from '@/store/dealsSlice';
import { Loading, Card, Badge, Button, EmptyState, Input, Select } from '@/components/UI';
import { formatCurrency, formatPercent, getRiskColor, getRiskLabel } from '@/utils/theme';
import { useDebounce } from '@/hooks/useCustomHooks';

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Deal Explorer</h1>
          <p className="text-muted">Discover and analyze investment opportunities</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6">
          <h3 className="font-semibold mb-6">Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Search */}
            <div className="form-group">
              <label className="text-sm font-semibold">Search</label>
              <Input
                type="text"
                placeholder="Company name or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border-border"
              />
              {/* shadcn Input used for search filter */}
            </div>

            {/* Industry */}
            <div className="form-group">
              <label className="text-sm font-semibold">Industry</label>
              <Select
                value={selectedIndustry}
                onChange={e => setSelectedIndustry(e.target.value)}
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
                className="input"
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
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={minRisk}
                  onChange={e => setMinRisk(Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={maxRisk}
                  onChange={e => setMaxRisk(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </Card>

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
            <div className="grid grid-cols-1 gap-4 mb-8">
              {deals.map(deal => (
                <Card key={deal.id} className="cursor-pointer hover:border-primary transition">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{deal.company}</h4>
                      <p className="text-sm text-muted mb-3 line-clamp-2">{deal.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="primary">{deal.stage}</Badge>
                        <Badge variant="warning">{deal.industry}</Badge>
                        <Badge variant="success">{deal.yearFounded}</Badge>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">{deal.roi}%</p>
                        <p className="text-xs text-muted">Expected ROI</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{getRiskLabel(deal.riskScore)}</p>
                        <p className="text-xs text-muted">{deal.riskScore} Risk Score</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(deal.fundingTarget)}</p>
                        <p className="text-xs text-muted">Target Raise</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={page === p ? 'primary' : 'secondary'}
                    onClick={() => handlePageChange(p)}
                    className={page === p ? '' : ''}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
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
