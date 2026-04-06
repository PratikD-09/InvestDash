'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUserInterests, removeUserInterest } from '@/store/investorsSlice';
import { fetchDeals } from '@/store/dealsSlice';
import { Card, Badge, Button, EmptyState, Loading } from '@/components/UI';
import { formatCurrency, formatPercent, getRiskLabel } from '@/utils/theme';
import { DealService } from '@/services/dealService';
import { useState } from 'react';

export default function MyPortfolioPage() {
  const dispatch = useAppDispatch();
  const { userInterests } = useAppSelector(state => state.investors);
  const { deals, loading: dealsLoading } = useAppSelector(state => state.deals);
  const [myInterestDeals, setMyInterestDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load interests from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userInterests');
      if (saved) {
        dispatch(loadUserInterests(JSON.parse(saved)));
      }
    }

    // Fetch all deals so we can find the ones in interests
    dispatch(fetchDeals({ pageSize: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (deals.length > 0) {
      const filtered = deals.filter(deal => userInterests.includes(deal.id));
      setMyInterestDeals(filtered);
      setLoading(false);
    }
  }, [deals, userInterests]);

  if (loading || dealsLoading) {
    return (
      <div className="min-h-screen flex-center">
        <Loading text="Loading your portfolio..." />
      </div>
    );
  }

  const totalPotentialROI = myInterestDeals.reduce((sum, d) => sum + d.roi, 0) / Math.max(myInterestDeals.length, 1);
  const avgRiskScore = myInterestDeals.reduce((sum, d) => sum + d.riskScore, 0) / Math.max(myInterestDeals.length, 1);
  const totalFunding = myInterestDeals.reduce((sum, d) => sum + d.fundingTarget, 0);

  return (
    <main className="min-h-screen p-6 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Portfolio</h1>
          <p className="text-muted">Deals you're interested in</p>
        </div>

        {/* Portfolio Stats */}
        {myInterestDeals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-sm text-muted mb-2">Portfolio Size</p>
              <h3 className="text-2xl font-bold">{myInterestDeals.length} Deals</h3>
            </Card>
            <Card>
              <p className="text-sm text-muted mb-2">Average ROI</p>
              <h3 className="text-2xl font-bold text-success">{formatPercent(totalPotentialROI)}</h3>
            </Card>
            <Card>
              <p className="text-sm text-muted mb-2">Total Capital Required</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalFunding)}</h3>
            </Card>
          </div>
        )}

        {/* Deals List */}
        {myInterestDeals.length === 0 ? (
          <EmptyState
            icon="📊"
            title="No deals in your portfolio yet"
            description="Start adding deals to track your investment interests."
          />
        ) : (
          <div className="space-y-4">
            {myInterestDeals.map(deal => (
              <Card
                key={deal.id}
                className="cursor-pointer hover:border-primary transition"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{deal.company}</h4>
                      <Badge variant="primary">{deal.stage}</Badge>
                    </div>
                    <p className="text-sm text-muted mb-3 line-clamp-2">{deal.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning" size="sm">
                        {deal.industry}
                      </Badge>
                      <Badge variant="success" size="sm">
                        Founded {deal.yearFounded}
                      </Badge>
                      <Badge variant="primary" size="sm">
                        {deal.investorCount} Investors
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
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
                      <p className="text-xs text-muted">Target</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 border-t border-border pt-4">
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => dispatch(removeUserInterest(deal.id))}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
