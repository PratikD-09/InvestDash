import investorsData from '@/data/investors.json';

export interface Investor {
  id: string;
  name: string;
  email: string;
  portfolio: string;
  investmentSize: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  totalInvestments: number;
  activeDealCount: number;
  averageROI: number;
  website: string;
  avatar: string;
  preferredIndustries: string[];
}

const typedInvestorsData = investorsData as Investor[];

export interface InvestorsResponse {
  investors: Investor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface InvestorFilterOptions {
  search?: string;
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  investmentSize?: string;
  sortBy?: 'name' | 'roi' | 'investments' | 'deals';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class InvestorService {
  // Get all investors with optional filtering
  static async getInvestors(filters?: InvestorFilterOptions): Promise<InvestorsResponse> {
    await delay(Math.random() * 500 + 300);

    let filteredInvestors = [...typedInvestorsData];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredInvestors = filteredInvestors.filter(
        investor =>
          investor.name.toLowerCase().includes(searchTerm) ||
          investor.email.toLowerCase().includes(searchTerm) ||
          investor.portfolio.toLowerCase().includes(searchTerm)
      );
    }

    // Apply risk profile filter
    if (filters?.riskProfile) {
      filteredInvestors = filteredInvestors.filter(
        investor => investor.riskProfile === filters.riskProfile
      );
    }

    // Apply investment size filter
    if (filters?.investmentSize) {
      filteredInvestors = filteredInvestors.filter(
        investor => investor.investmentSize === filters.investmentSize
      );
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'name';
    const sortOrder = filters?.sortOrder || 'asc';

    filteredInvestors.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'roi':
          aValue = a.averageROI;
          bValue = b.averageROI;
          break;
        case 'investments':
          aValue = a.totalInvestments;
          bValue = b.totalInvestments;
          break;
        case 'deals':
          aValue = a.activeDealCount;
          bValue = b.activeDealCount;
          break;
        case 'name':
        default:
          aValue = a.name;
          bValue = b.name;
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
    const paginatedInvestors = filteredInvestors.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredInvestors.length / pageSize);

    return {
      investors: paginatedInvestors,
      total: filteredInvestors.length,
      page,
      pageSize,
      totalPages,
    };
  }

  // Get single investor by ID
  static async getInvestorById(id: string): Promise<Investor | null> {
    await delay(Math.random() * 400 + 200);
    return typedInvestorsData.find(investor => investor.id === id) || null;
  }

  // Get investors by risk profile
  static async getInvestorsByRiskProfile(
    riskProfile: 'conservative' | 'moderate' | 'aggressive'
  ): Promise<Investor[]> {
    await delay(Math.random() * 500 + 300);
    return typedInvestorsData.filter(investor => investor.riskProfile === riskProfile);
  }

  // Get investment sizes
  static async getInvestmentSizes(): Promise<string[]> {
    await delay(Math.random() * 300 + 100);
    const sizes = new Set(typedInvestorsData.map(investor => investor.investmentSize));
    return Array.from(sizes).sort();
  }

  // Get risk profiles
  static async getRiskProfiles(): Promise<string[]> {
    await delay(Math.random() * 300 + 100);
    return ['conservative', 'moderate', 'aggressive'];
  }

  // Get top investors by ROI
  static async getTopInvestorsByROI(limit: number = 10): Promise<Investor[]> {
    await delay(Math.random() * 500 + 300);
    return [...typedInvestorsData]
      .sort((a, b) => b.averageROI - a.averageROI)
      .slice(0, limit);
  }

  // Get investors by industry preference
  static async getInvestorsByIndustry(industry: string): Promise<Investor[]> {
    await delay(Math.random() * 500 + 300);
    return typedInvestorsData.filter(investor => investor.preferredIndustries.includes(industry));
  }

  // Get investor statistics
  static async getInvestorStats(): Promise<{
    totalInvestors: number;
    totalCapital: number;
    averageROI: number;
    averageDealsPerInvestor: number;
  }> {
    await delay(Math.random() * 400 + 200);

    const totalInvestors = typedInvestorsData.length;
    const totalCapital = typedInvestorsData.reduce((sum, i) => sum + i.totalInvestments, 0);
    const averageROI = typedInvestorsData.reduce((sum, i) => sum + i.averageROI, 0) / totalInvestors;
    const averageDealsPerInvestor =
      typedInvestorsData.reduce((sum, i) => sum + i.activeDealCount, 0) / totalInvestors;

    return {
      totalInvestors,
      totalCapital,
      averageROI: Math.round(averageROI * 10) / 10,
      averageDealsPerInvestor: Math.round(averageDealsPerInvestor * 10) / 10,
    };
  }

  // Get risk distribution
  static async getRiskDistribution(): Promise<Record<string, number>> {
    await delay(Math.random() * 400 + 200);

    const distribution: Record<string, number> = {
      conservative: 0,
      moderate: 0,
      aggressive: 0,
    };

    typedInvestorsData.forEach(investor => {
      distribution[investor.riskProfile]++;
    });

    return distribution;
  }

  // Get investors portfolio statistics
  static async getPortfolioStats(): Promise<Record<string, any>> {
    await delay(Math.random() * 400 + 200);

    return {
      portfolioCount: typedInvestorsData.length,
      totalCapitalUndermanagement: 70000000,
      portfolioGrowthRate: 24.5,
      benchmarkROI: 28.3,
    };
  }
}
