import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "../../utils/storage";
import { SESSION_DURATION, STORAGE_KEYS } from "../../utils/constants";

// ============================================
// TYPES & INTERFACES
// ============================================

// USER DATA INTERFACE
interface User {
    name?: string;
    email: string;
    phone?: string;
    password?: string;
    id?: number;
    createdAt?: string;
    expiresIn?: string;
}

// AUTH STATE INTERFACE
interface AuthState {
    user: User | null;          
    isAuthenticated: boolean;
    loading: boolean; 
    error: string | null;
}


// REGISTRATION DATA INTERFACE
interface SignupData {
    name: string;
    email: string;
    phone?: string;
    password: string;
}

// LOGIN DATA INTERFACE
interface LoginCred {
    email: string;
    password: string;
}


// ============================================
// HELPER FUNCTIONS
// ============================================

// GET ALL REGISTERED USER FROM STORAGE
const getAllUsers = (): (SignupData & { id: number; createdAt: string; expiresIn: string })[] => {
    return storage.get(STORAGE_KEYS.USERS) || [];
};

// SAVE A USER TO STORAGE
const saveUserToStorage = (userData: SignupData): User => {
    const users = getAllUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
        // Check if account has expired
        if (existingUser.expiresIn && existingUser.expiresIn < new Date().toISOString()) {
            // Remove expired account
            const updatedUsers = users.filter(u => u.email !== userData.email);
            storage.set(STORAGE_KEYS.USERS, updatedUsers);
        } else {
            throw new Error('User with this email already exists');
        }
    }
    
    // Create new user with ID and timestamp
    const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        expiresIn: new Date(Date.now() + SESSION_DURATION).toISOString(),
    };
    
    // Add to users array and save
    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    
    // Return user without password
    const { password, ...userExpectedData } = newUser;
    return userExpectedData;
};

// VALIDATE LOGIN CREDENTIALS 
const validateCredentials = (email: string, password: string): User => {
    const users = getAllUsers();
    
    // Find user with matching credentials
    const user = users.find(u => u.email?.toLowerCase() === email);
    if (!user) {
        throw new Error("Account does not or no longer exist");
    }
    
    if(user && user.password !== password) {
        throw new Error('Invalid email or password');
    }

    // Check if account has expired
    if (user.expiresIn && user.expiresIn < new Date().toISOString()) {
        // Remove expired account
        const updatedUsers = users.filter(u => u.email.toLowerCase() !== email);
        storage.set(STORAGE_KEYS.USERS, updatedUsers);
        throw new Error('Account has expired. Please sign up again');
    }
    
    // Return user without password
    const { password: _, ...userExpectedData } = user;
    return userExpectedData;
};

// CLEAR ACCOUNT SESSION
const clearAccountSession = function(): void {
    const user = storage.get<User>(STORAGE_KEYS.CURRENT_USER);

    if (user) {
        const users = getAllUsers();
        const updatedUsers = users.filter(u => u.email !== user.email);
        storage.set(STORAGE_KEYS.USERS, updatedUsers);
    }
    storage.remove(STORAGE_KEYS.CURRENT_USER);
};

// CHECK IF ACCOUNT SESSION IS EXPIRED 
export const isSessionExpired = function() {
    const user = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
    if(user) {
        // Check if current time is past expiry time
        return user?.expiresIn && user?.expiresIn < new Date().toISOString() ;
    }
};

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Saves user to localStorage and sets as current user
 */
export const registerUser = createAsyncThunk<User, SignupData, { rejectValue: string }>(
  'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Save user to storage
            const user = saveUserToStorage(userData);
            return user;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Registration failed');
        }
    }
);

/**
 * Validates credentials and sets as current user
 */
export const loginUser = createAsyncThunk<User, LoginCred, { rejectValue: string }>(
  'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Validate credentials
            const user = validateCredentials(credentials.email, credentials.password);
            
            // Set as current user
            storage.set(STORAGE_KEYS.CURRENT_USER, user);
            
            return user;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Login failed');
        }
    }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState: AuthState = {
    // Try to load user from storage on app start
    // user: storage.get<User>(STORAGE_KEYS.CURRENT_USER),
    // isAuthenticated: storage.has(STORAGE_KEYS.CURRENT_USER),
    user: isSessionExpired() ? null : storage.get<User>(STORAGE_KEYS.CURRENT_USER),
    isAuthenticated: !isSessionExpired() && storage.has(STORAGE_KEYS.CURRENT_USER),
    loading: false,
    error: null,
};


const authSlice = createSlice({
    name: "auth/slice",
    initialState,
    reducers: {
        /**
         * Logout action
         */
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            storage.remove(STORAGE_KEYS.CURRENT_USER);
        },
        /**
         * Handle Expired account session action
         */
        handleAccountSessionExpired: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = 'Your session has expired. Please login again.';
            clearAccountSession();
        },
        /**
         * Clear error action
         */
        clearError: (state) => {
            state.error = null;
        },

        /**
         * Set user action
         */
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            storage.set(STORAGE_KEYS.CURRENT_USER, action.payload);
        },
    },
    extraReducers: (builder) => {
        // REGISTER CASES
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            // state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            // state.isAuthenticated = false;
            state.error = action.payload || 'Registration failed';
        });

        // LOGIN CASES
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload || 'Login failed';
        });
    },
});


// Export actions
export const { logout, clearError, setUser, handleAccountSessionExpired } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;