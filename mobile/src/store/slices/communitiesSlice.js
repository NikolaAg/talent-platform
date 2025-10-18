import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communitiesAPI } from '../../services/api';

export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await communitiesAPI.getCommunities(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки сообществ');
    }
  }
);

export const joinCommunity = createAsyncThunk(
  'communities/joinCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communitiesAPI.joinCommunity(communityId);
      return { communityId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка вступления в сообщество');
    }
  }
);

export const createCommunity = createAsyncThunk(
  'communities/createCommunity',
  async (communityData, { rejectWithValue }) => {
    try {
      const response = await communitiesAPI.createCommunity(communityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка создания сообщества');
    }
  }
);

const communitiesSlice = createSlice({
  name: 'communities',
  initialState: {
    list: [],
    currentCommunity: null,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCommunity: (state, action) => {
      state.currentCommunity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка сообществ
      .addCase(fetchCommunities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.communities;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount
        };
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Вступление в сообщество
      .addCase(joinCommunity.fulfilled, (state, action) => {
        const community = state.list.find(c => c.id === action.payload.communityId);
        if (community) {
          community.memberCount += 1;
          community.userMembership = { role: 'member' };
        }
      })
      // Создание сообщества
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.list.unshift(action.payload.community);
      });
  },
});

export const { clearError, setCurrentCommunity } = communitiesSlice.actions;
export default communitiesSlice.reducer;
