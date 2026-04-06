import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Investor, InvestorService, InvestorFilterOptions, InvestorsResponse } from '@/services/investorService';

interface InvestorsState {
  investors: Investor[];
  currentInvestor: Investor | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: InvestorFilterOptions;
  investmentSizes: string[];
  riskProfiles: string[];
  stats: {
    totalInvestors: number;
    totalCapital: number;
    averageROI: number;
    averageDealsPerInvestor: number;
  } | null;
  riskDistribution: Record<string, number> | null;
  userInterests: string[]; // Deal IDs
}

const initialState: InvestorsState = {
  investors: [],
  currentInvestor: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
  filters: { page: 1, pageSize: 10 },
  investmentSizes: [],
  riskProfiles: [],
  stats: null,
  riskDistribution: null,
  userInterests: [],
};

// Async thunks
export const fetchInvestors = createAsyncThunk(
  'investors/fetchInvestors',
  async (filters?: InvestorFilterOptions) => {
    return await InvestorService.getInvestors(filters);
  }
);

export const fetchInvestorById = createAsyncThunk(
  'investors/fetchInvestorById',
  async (id: string) => {
    return await InvestorService.getInvestorById(id);
  }
);

export const fetchInvestmentSizes = createAsyncThunk(
  'investors/fetchInvestmentSizes',
  async () => {
    return await InvestorService.getInvestmentSizes();
  }
);

export const fetchRiskProfiles = createAsyncThunk('investors/fetchRiskProfiles', async () => {
  return await InvestorService.getRiskProfiles();
});

export const fetchInvestorStats = createAsyncThunk('investors/fetchInvestorStats', async () => {
  return await InvestorService.getInvestorStats();
});

export const fetchRiskDistribution = createAsyncThunk(
  'investors/fetchRiskDistribution',
  async () => {
    return await InvestorService.getRiskDistribution();
  }
);

const investorsSlice = createSlice({
  name: 'investors',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<InvestorFilterOptions>) => {
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
    addUserInterest: (state, action: PayloadAction<string>) => {
      if (!state.userInterests.includes(action.payload)) {
        state.userInterests.push(action.payload);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInterests', JSON.stringify(state.userInterests));
        }
      }
    },
    removeUserInterest: (state, action: PayloadAction<string>) => {
      state.userInterests = state.userInterests.filter(id => id !== action.payload);
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInterests', JSON.stringify(state.userInterests));
      }
    },
    loadUserInterests: (state, action: PayloadAction<string[]>) => {
      state.userInterests = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch investors
    builder
      .addCase(fetchInvestors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload as InvestorsResponse;
        state.investors = response.investors;
        state.total = response.total;
        state.page = response.page;
        state.pageSize = response.pageSize;
        state.totalPages = response.totalPages;
      })
      .addCase(fetchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investors';
      });

    // Fetch investor by ID
    builder
      .addCase(fetchInvestorById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvestor = action.payload;
      })
      .addCase(fetchInvestorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investor';
      });

    // Fetch investment sizes
    builder
      .addCase(fetchInvestmentSizes.fulfilled, (state, action) => {
        state.investmentSizes = action.payload;
      });

    // Fetch risk profiles
    builder
      .addCase(fetchRiskProfiles.fulfilled, (state, action) => {
        state.riskProfiles = action.payload;
      });

    // Fetch investor stats
    builder
      .addCase(fetchInvestorStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });

    // Fetch risk distribution
    builder
      .addCase(fetchRiskDistribution.fulfilled, (state, action) => {
        state.riskDistribution = action.payload;
      });
  },
});

export const {
  setFilters,
  setPage,
  clearFilters,
  addUserInterest,
  removeUserInterest,
  loadUserInterests,
} = investorsSlice.actions;
export default investorsSlice.reducer;
