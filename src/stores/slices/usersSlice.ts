import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/axios.config';

// ============================================
// TYPES & INTERFACES
// ============================================

// USERS INTERFACE
interface User {
    id: number;
    name: string;
    email: string;
}

// USER STATE INTERFACE
interface UsersState {
    items: User[];
    loading: boolean;
    error: string | null;
}

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Fetch all users from the API
 * GET /users
 */
export const fetchUsers = createAsyncThunk<User[], void,{ rejectValue: string }>(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // Make GET request using our configured api instance
            const response = await api.get<User[]>('/users');
            
            // Return the data (array of users)
            return response.data;
        } catch (error) {
            // Handle errors
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch users');
        }
    }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState: UsersState = {
    items: [],
    loading: false,
    error: null,
};

// ============================================
// USERS SLICE
// ============================================

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH USERS CASES
    builder
      // When fetchUsers is called
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetchUsers succeeds
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      // When fetchUsers fails
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
        state.items = [];
      });
  },
});



// Export actions
export const { clearError } = usersSlice.actions;

// Export reducer
export default usersSlice.reducer;

// Export selectors
export const selectUsers = (state: { users: UsersState }) => state.users.items;
export const selectUsersLoading = (state: { users: UsersState }) => state.users.loading;
export const selectUsersError = (state: { users: UsersState }) => state.users.error;