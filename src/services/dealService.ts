import dealsData from '@/data/deals.json';

export interface Deal {
  id: string;
  company: string;
  industry: string;
  stage: string;
  fundingTarget: number;
  fundingRaised: number;
  valuation: number;
  roi: number;
  riskScore: number;
  description: string;
  investorCount: number;
  yearFounded: number;
  employees: number;
  metric1: number;
  metric2: number;
  roiProjection: number[];
  monthsToExit: number;
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DealFilterOptions {
  search?: string;
  industry?: string;
  stage?: string;
  minROI?: number;
  maxROI?: number;
  minRisk?: number;
  maxRisk?: number;
  minFunding?: number;
  maxFunding?: number;
  sortBy?: 'roi' | 'risk' | 'stage' | 'company' | 'funding';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DealService {
  // Get all deals with optional filtering
  static async getDeals(filters?: DealFilterOptions): Promise<DealsResponse> {
    await delay(Math.random() * 500 + 300);

    let filteredDeals = [...dealsData] as Deal[];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDeals = filteredDeals.filter(
        deal =>
          deal.company.toLowerCase().includes(searchTerm) ||
          deal.description.toLowerCase().includes(searchTerm) ||
          deal.industry.toLowerCase().includes(searchTerm)
      );
    }

    // Apply industry filter
    if (filters?.industry) {
      filteredDeals = filteredDeals.filter(deal => deal.industry === filters.industry);
    }

    // Apply stage filter
    if (filters?.stage) {
      filteredDeals = filteredDeals.filter(deal => deal.stage === filters.stage);
    }

    // Apply ROI range filter
    if (filters?.minROI !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.roi >= filters.minROI!);
    }
    if (filters?.maxROI !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.roi <= filters.maxROI!);
    }

    // Apply Risk range filter
    if (filters?.minRisk !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.riskScore >= filters.minRisk!);
    }
    if (filters?.maxRisk !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.riskScore <= filters.maxRisk!);
    }

    // Apply funding range filter
    if (filters?.minFunding !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.fundingTarget >= filters.minFunding!);
    }
    if (filters?.maxFunding !== undefined) {
      filteredDeals = filteredDeals.filter(deal => deal.fundingTarget <= filters.maxFunding!);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'roi';
    const sortOrder = filters?.sortOrder || 'desc';

    filteredDeals.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'roi':
          aValue = a.roi;
          bValue = b.roi;
          break;
        case 'risk':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        case 'funding':
          aValue = a.fundingTarget;
          bValue = b.fundingTarget;
          break;
        case 'company':
          aValue = a.company;
          bValue = b.company;
          break;
        case 'stage':
          aValue = a.stage;
          bValue = b.stage;
          break;
        default:
          aValue = a.roi;
          bValue = b.roi;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      const numA = typeof aValue === 'number' ? aValue : 0;
      const numB = typeof bValue === 'number' ? bValue : 0;
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    // Apply pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredDeals.length / pageSize);

    return {
      deals: paginatedDeals,
      total: filteredDeals.length,
      page,
      pageSize,
      totalPages,
    };
  }

  // Get single deal by ID
  static async getDealById(id: string): Promise<Deal | null> {
    await delay(Math.random() * 400 + 200);
    return dealsData.find(deal => deal.id === id) || null;
  }

  // Get deals by industry
  static async getDealsByIndustry(industry: string): Promise<Deal[]> {
    await delay(Math.random() * 500 + 300);
    return dealsData.filter(deal => deal.industry === industry);
  }

  // Get deals by stage
  static async getDealsByStage(stage: string): Promise<Deal[]> {
    await delay(Math.random() * 500 + 300);
    return dealsData.filter(deal => deal.stage === stage);
  }

  // Get industries list
  static async getIndustries(): Promise<string[]> {
    await delay(Math.random() * 300 + 100);
    const industries = new Set(dealsData.map(deal => deal.industry));
    return Array.from(industries).sort();
  }

  // Get stages list
  static async getStages(): Promise<string[]> {
    await delay(Math.random() * 300 + 100);
    const stages = new Set(dealsData.map(deal => deal.stage));
    return Array.from(stages).sort();
  }

  // Get top deals by ROI
  static async getTopDealsByROI(limit: number = 10): Promise<Deal[]> {
    await delay(Math.random() * 500 + 300);
    return [...dealsData]
      .sort((a, b) => b.roi - a.roi)
      .slice(0, limit);
  }

  // Get deals statistics
  static async getDealStats(): Promise<{
    totalDeals: number;
    avgROI: number;
    avgRisk: number;
    totalFundingTarget: number;
    totalFundingRaised: number;
  }> {
    await delay(Math.random() * 400 + 200);

    const totalDeals = dealsData.length;
    const avgROI = dealsData.reduce((sum, d) => sum + d.roi, 0) / totalDeals;
    const avgRisk = dealsData.reduce((sum, d) => sum + d.riskScore, 0) / totalDeals;
    const totalFundingTarget = dealsData.reduce((sum, d) => sum + d.fundingTarget, 0);
    const totalFundingRaised = dealsData.reduce((sum, d) => sum + d.fundingRaised, 0);

    return {
      totalDeals,
      avgROI: Math.round(avgROI * 10) / 10,
      avgRisk: Math.round(avgRisk * 10) / 10,
      totalFundingTarget,
      totalFundingRaised,
    };
  }

  // Get industry distribution
  static async getIndustryDistribution(): Promise<Record<string, number>> {
    await delay(Math.random() * 400 + 200);

    const distribution: Record<string, number> = {};
    dealsData.forEach(deal => {
      distribution[deal.industry] = (distribution[deal.industry] || 0) + 1;
    });
    return distribution;
  }

  // Simulate error state (optional)
  static async simulateError(): Promise<never> {
    await delay(Math.random() * 500 + 300);
    throw new Error('Simulated API error');
  }
}
