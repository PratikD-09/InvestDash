'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInvestors, setPage } from '@/store/investorsSlice';
import { Loading, Card, Badge, Button, EmptyState, Input, Select } from '@/components/UI';
import { formatCurrency, formatPercent } from '@/utils/theme';
import { useDebounce } from '@/hooks/useCustomHooks';

export default function InvestorsPage() {
  const dispatch = useAppDispatch();
  const {
    investors,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    riskProfiles,
  } = useAppSelector(state => state.investors);

  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      fetchInvestors({
        search: debouncedSearch,
        riskProfile: (selectedRisk as any) || undefined,
        page: 1,
        pageSize,
      })
    );
  }, [debouncedSearch, selectedRisk, dispatch, pageSize]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(
      fetchInvestors({
        search: debouncedSearch,
        riskProfile: (selectedRisk as any) || undefined,
        page: newPage,
        pageSize,
      })
    );
  };

  return (
    <main className="min-h-screen !p-6 md:!p-8" style={{ backgroundColor: 'var(--bg)' }}>
      <div className=" mx-auto">
        <div className="!mb-8">
          <h1 className="text-4xl font-bold !mb-2">Investors</h1>
          <p className="text-muted">Explore and connect with investment partners</p>
        </div>

        {/* Filters */}
        <Card className="!mb-8 p-6">
          <h3 className="font-semibold !mb-6">Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="text-sm font-semibold">Search</label>
              <Input
                className='!p-3'
                type="text"
                placeholder="Investor name or portfolio..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {/* shadcn Input used for investor search */}
            </div>

            <div className="form-group">
              <label className="text-sm font-semibold">Risk Profile</label>
              <Select
                value={selectedRisk}
                className='!p-3'
                onChange={e => setSelectedRisk(e.target.value)}
              >
                <option value="">All Risk Profiles</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </Select>
              {/* shadcn Select used for risk profile filter */}
            </div>
          </div>
        </Card>

        {/* Investors Grid */}
        {loading ? (
          <div className="flex-center py-12">
            <Loading text="Loading investors..." />
          </div>
        ) : investors.length === 0 ? (
          <EmptyState
            title="No investors found"
            description="Try adjusting your filters."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8">
              {investors.map(investor => (
                <Card key={investor.id} className="cursor-pointer hover:border-primary transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: 'var(--primary)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.25rem',
                        }}
                      >
                        {investor.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{investor.name}</h4>
                        <p className="text-sm text-muted">{investor.portfolio}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        investor.riskProfile === 'aggressive'
                          ? 'danger'
                          : investor.riskProfile === 'moderate'
                            ? 'warning'
                            : 'success'
                      }
                    >
                      {investor.riskProfile}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted mb-4 line-clamp-2">{investor.email}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted">Total Invested</p>
                      <p className="font-semibold text-sm">{formatCurrency(investor.totalInvestments)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Active Deals</p>
                      <p className="font-semibold text-sm">{investor.activeDealCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Average ROI</p>
                      <p className="font-semibold text-sm text-success">{investor.averageROI}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Investment Size</p>
                      <p className="font-semibold text-sm">{investor.investmentSize}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted mb-2">Preferred Industries</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.preferredIndustries.map(ind => (
                        <Badge key={ind} variant="primary" size="sm">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button variant="primary" className="w-full" size="sm">
                    View Profile
                  </Button>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 !mt-8">
                <Button
                    className='m-2 p-2'
                  variant="secondary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                  className='m-2 w-2 h-2 p-2'
                    key={p}
                    variant={page === p ? 'primary' : 'secondary'}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                className='m-2 p-2'
                  variant="secondary"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}

            <p className="text-center text-sm text-muted !mt-6">
              Showing {investors.length} of {total} investors
            </p>
          </>
        )}
      </div>
    </main>
  );
}
