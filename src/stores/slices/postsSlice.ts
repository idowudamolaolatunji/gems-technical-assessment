import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/axios.config"

// ============================================
// TYPES & INTERFACES
// ============================================

// POST INTERFACE
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// POSTSTATE INTERFACE
interface PostsState {
    items: Post[];
    filteredItems: Post[];
    loading: boolean;
    error: string | null;
    searchQuery: string; 
    filterUserId: number | null;
}


// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Fetch all posts from the API
 * GET /posts
 */
export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  'posts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Make GET request using our configured api instance
      const response = await api.get<Post[]>('/posts');
      
      // Return the data (array of posts)
      return response.data;
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch posts');
    }
  }
);

/**
 * Fetch posts by a specific user ID
 * GET /posts?userId={userId}
 */
export const fetchPostsByUserId = createAsyncThunk<Post[], number, { rejectValue: string }>(
  'posts/fetchByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      // Make GET request with query parameter
      const response = await api.get<Post[]>(`/posts?userId=${userId}`);
      
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch user posts');
    }
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Filter posts based on search query and user filter
 * Pure function - doesn't modify state
 */
const filterPosts = (posts: Post[], searchQuery: string, userId: number | null): Post[] => {
  return posts.filter((post) => {
    // Check if post matches search query
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) 
    //   || post.body.toLowerCase().includes(searchQuery.toLowerCase())
    ;

    // Check if post matches user filter
    const matchesUser = userId === null || post.userId === userId;

    // Post must match both conditions
    return matchesSearch && matchesUser;
  });
};

// ============================================
// INITIAL STATE
// ============================================

const initialState: PostsState = {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchQuery: '',
    filterUserId: null,
};

// ============================================
// POST SLICE
// ============================================

const postsSlice = createSlice({
    name: "post/slice",
    initialState,
    reducers: {
    /**
     * Set search query and filter posts
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Re-filter posts with new search query
      state.filteredItems = filterPosts(
        state.items,
        action.payload,
        state.filterUserId
      );
    },

    /**
     * Set user filter and filter posts
     */
    setUserFilter: (state, action: PayloadAction<number | null>) => {
      state.filterUserId = action.payload;
      // Re-filter posts with new user filter
      state.filteredItems = filterPosts(
        state.items,
        state.searchQuery,
        action.payload
      );
    },

    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.searchQuery = '';
      state.filterUserId = null;
      // Show all posts when filters are cleared
      state.filteredItems = state.items;
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL POSTS CASES
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Apply current filters to new data
        state.filteredItems = filterPosts(
          action.payload,
          state.searchQuery,
          state.filterUserId
        );
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts';
        state.items = [];
        state.filteredItems = [];
      });

    // FETCH POSTS BY USER ID CASES
    builder
      .addCase(fetchPostsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Apply current filters to new data
        state.filteredItems = filterPosts(
          action.payload,
          state.searchQuery,
          state.filterUserId
        );
        state.error = null;
      })
      .addCase(fetchPostsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user posts';
        state.items = [];
        state.filteredItems = [];
      });
    },
});

// Export actions
export const { setSearchQuery, setUserFilter, clearFilters, clearError } = postsSlice.actions;

// Export reducer
export default postsSlice.reducer;

// Export selectors
export const selectPosts = (state: { posts: PostsState }) => state.posts.items;
export const selectFilteredPosts = (state: { posts: PostsState }) => state.posts.filteredItems;
export const selectPostsLoading = (state: { posts: PostsState }) => state.posts.loading;
export const selectPostsError = (state: { posts: PostsState }) => state.posts.error;
export const selectSearchQuery = (state: { posts: PostsState }) => state.posts.searchQuery;
export const selectUserFilter = (state: { posts: PostsState }) => state.posts.filterUserId;