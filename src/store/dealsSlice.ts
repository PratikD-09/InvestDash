import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Deal, DealService, DealFilterOptions, DealsResponse } from '@/services/dealService';

interface DealsState {
  deals: Deal[];
  currentDeal: Deal | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: DealFilterOptions;
  industries: string[];
  stages: string[];
  stats: {
    totalDeals: number;
    avgROI: number;
    avgRisk: number;
    totalFundingTarget: number;
    totalFundingRaised: number;
  } | null;
  industryDistribution: Record<string, number> | null;
}

const initialState: DealsState = {
  deals: [],
  currentDeal: null,
  total: 0,
  page: 1 , 
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
  filters: { page: 1, pageSize: 10 },
  industries: [],
  stages: [],
  stats: null,
  industryDistribution: null,
};

// Async thunks
export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async (filters?: DealFilterOptions) => {
    return await DealService.getDeals(filters);
  }
);

export const fetchDealById = createAsyncThunk('deals/fetchDealById', async (id: string) => {
  return await DealService.getDealById(id);
});

export const fetchIndustries = createAsyncThunk('deals/fetchIndustries', async () => {
  return await DealService.getIndustries();
});

export const fetchStages = createAsyncThunk('deals/fetchStages', async () => {
  return await DealService.getStages();
});

export const fetchDealStats = createAsyncThunk('deals/fetchDealStats', async () => {
  return await DealService.getDealStats();
});

export const fetchIndustryDistribution = createAsyncThunk(
  'deals/fetchIndustryDistribution',
  async () => {
    return await DealService.getIndustryDistribution();
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<DealFilterOptions>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      state.filters.page = action.payload;
    },
    clearFilters: state => {
      state.filters = { page: 1, pageSize: 10 };
      state.page = 1;
    },
  },
  extraReducers: builder => {
    // Fetch deals
    builder
      .addCase(fetchDeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload as DealsResponse;
        state.deals = response.deals;
        state.total = response.total;
        state.page = response.page;
        state.pageSize = response.pageSize;
        state.totalPages = response.totalPages;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch deals';
      });

    // Fetch deal by ID
    builder
      .addCase(fetchDealById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeal = action.payload;
      })
      .addCase(fetchDealById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch deal';
      });

    // Fetch industries
    builder
      .addCase(fetchIndustries.pending, () => {})
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries = action.payload;
      });

    // Fetch stages
    builder
      .addCase(fetchStages.pending, () => {})
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.stages = action.payload;
      });

    // Fetch deal stats
    builder
      .addCase(fetchDealStats.pending, () => {})
      .addCase(fetchDealStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });

    // Fetch industry distribution
    builder
      .addCase(fetchIndustryDistribution.pending, () => {})
      .addCase(fetchIndustryDistribution.fulfilled, (state, action) => {
        state.industryDistribution = action.payload;
      });
  },
});

export const { setFilters, setPage, clearFilters } = dealsSlice.actions;
export default dealsSlice.reducer;
