import { Deal } from '@/services/dealService';
import { Investor } from '@/services/investorService';

export interface DealRecommendation {
  deal: Deal;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  /**
   * Calculate recommendation score for a deal based on investor profile
   * Score ranges from 0-100
   */
  static calculateDealScore(deal: Deal, investor: Investor): number {
    let score = 0;
    const reasons: string[] = [];

    // Risk alignment (30 points)
    const riskAlignment = this.calculateRiskAlignment(deal.riskScore, investor.riskProfile);
    score += riskAlignment * 30;

    // Industry match (25 points)
    const industryMatch = deal.industry === 'Various' 
      ? 0 
      : investor.preferredIndustries.includes(deal.industry) ? 25 : 5;
    score += industryMatch;

    // ROI attractiveness (25 points)
    const roiMatch = Math.min(deal.roi / 50 * 25, 25);
    score += roiMatch;

    // Funding alignment (15 points)
    const fundingAlignment = this.calculateFundingAlignment(
      deal.fundingTarget,
      investor.investmentSize
    );
    score += fundingAlignment * 15;

    // Stage preference - bonus
    const stageBonus = this.calculateStageBonus(deal.stage, investor.investmentSize);
    score += stageBonus;

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Get recommendations for an investor
   */
  static getRecommendations(
    deals: Deal[],
    investor: Investor,
    limit: number = 10
  ): DealRecommendation[] {
    const recommendations = deals
      .map(deal => ({
        deal,
        score: this.calculateDealScore(deal, investor),
        reasons: this.getRecommendationReasons(deal, investor),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations;
  }

  /**
   * Calculate risk score alignment (0-1)
   */
  private static calculateRiskAlignment(dealRisk: number, investorRisk: string): number {
    const riskLevel = {
      conservative: 40,
      moderate: 55,
      aggressive: 75,
    };

    const targetRisk = riskLevel[investorRisk as keyof typeof riskLevel];
    const difference = Math.abs(dealRisk - targetRisk);

    // Maximum difference is 60 (0-100 scale)
    return Math.max(0, 1 - difference / 60);
  }

  /**
   * Calculate funding alignment (0-1)
   */
  private static calculateFundingAlignment(dealFunding: number, investorSize: string): number {
    const sizeLimits = {
      'Seed to Series B': { min: 500000, max: 4000000 },
      'Series A to C': { min: 2000000, max: 8000000 },
      'Series B to D': { min: 4000000, max: 12000000 },
      'Series C to IPO': { min: 8000000, max: 20000000 },
      'All Stages': { min: 500000, max: 20000000 },
    };

    const limits = sizeLimits[investorSize as keyof typeof sizeLimits] || {
      min: 1000000,
      max: 10000000,
    };

    if (dealFunding < limits.min || dealFunding > limits.max) {
      return 0.3; // Slight penalty
    }

    // Closer to the middle of the range is better
    const middle = (limits.min + limits.max) / 2;
    const maxDistance = (limits.max - limits.min) / 2;
    const distance = Math.abs(dealFunding - middle);

    return Math.max(0.5, 1 - distance / maxDistance);
  }

  /**
   * Calculate stage bonus (additional score)
   */
  private static calculateStageBonus(stage: string, investorSize: string): number {
    const stageMap = {
      'Seed to Series B': ['Seed', 'Series A', 'Series B'],
      'Series A to C': ['Series A', 'Series B', 'Series C'],
      'Series B to D': ['Series B', 'Series C', 'Series D'],
      'Series C to IPO': ['Series C', 'Series D', 'IPO'],
      'All Stages': ['Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'IPO'],
    };

    const preferredStages = stageMap[investorSize as keyof typeof stageMap] || [];
    return preferredStages.includes(stage) ? 5 : 0;
  }

  /**
   * Generate recommendation reasons
   */
  private static getRecommendationReasons(deal: Deal, investor: Investor): string[] {
    const reasons: string[] = [];

    // Industry match
    if (investor.preferredIndustries.includes(deal.industry)) {
      reasons.push(`Matches preferred industry: ${deal.industry}`);
    }

    // High ROI
    if (deal.roi >= 45) {
      reasons.push(`Strong ROI potential: ${deal.roi}%`);
    } else if (deal.roi >= 35) {
      reasons.push(`Good ROI potential: ${deal.roi}%`);
    }

    // Risk alignment
    const riskAlignment = this.calculateRiskAlignment(deal.riskScore, investor.riskProfile);
    if (riskAlignment > 0.7) {
      reasons.push('Well-aligned risk profile');
    }

    // Funding fit
    const fundingAlignment = this.calculateFundingAlignment(deal.fundingTarget, investor.investmentSize);
    if (fundingAlignment > 0.8) {
      reasons.push('Fits investment size range');
    }

    // Stage fit
    const stageBonus = this.calculateStageBonus(deal.stage, investor.investmentSize);
    if (stageBonus > 0) {
      reasons.push(`Preferred stage: ${deal.stage}`);
    }

    // Time to exit
    if (deal.monthsToExit <= 30) {
      reasons.push(`Quick exit opportunity: ${deal.monthsToExit} months`);
    }

    // Company maturity
    const yearsFounded = new Date().getFullYear() - deal.yearFounded;
    if (yearsFounded >= 3) {
      reasons.push(`Established company: ${yearsFounded} years old`);
    }

    return reasons.slice(0, 3); // Return top 3 reasons
  }

  /**
   * Get bulk recommendations for all deals
   */
  static getAllRecommendations(
    deals: Deal[],
    investor: Investor
  ): Map<string, number> {
    const recommendations = new Map<string, number>();
    deals.forEach(deal => {
      recommendations.set(deal.id, this.calculateDealScore(deal, investor));
    });
    return recommendations;
  }

  /**
   * Batch score deals for performance optimization
   */
  static batchScoreDeals(deals: Deal[], investor: Investor): Deal[] {
    return deals
      .map(deal => ({
        ...deal,
        _score: this.calculateDealScore(deal, investor),
      }))
      .sort((a, b) => (b as any)._score - (a as any)._score)
      .map(({ _score, ...deal }) => deal);
  }
}
