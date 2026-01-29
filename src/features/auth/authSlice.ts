import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

interface User {
	id: string;
	email: string;
	role?: string;
}

interface AuthState {
	user: User | null;
	loading: boolean;
	initialized: boolean;
	isResetPasswordOTPSent: boolean;
	message: string | null;
	error: string | null;
	isPasswordChanged?: boolean;
}

const initialState: AuthState = {
	user: null,
	loading: false,
	initialized: false,
	isResetPasswordOTPSent: false,
	message: null,
	error: null,
	isPasswordChanged: false,
};

// 🔐 Login
export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (
		credentials: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post("/auth/login", credentials);
			return res.data.user;
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data?.message || "Login failed"
			);
		}
	}
);

// 🔁 Restore session
export const checkIsLoggedIn = createAsyncThunk(
	"auth/checkIsLoggedIn",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/auth/isLoggedIn");
			return res.data?.data;
		} catch {
			return rejectWithValue(null);
		}
	}
);

// 🔁 Send Reset Password OTP
export const sendResetPasswordOTP = createAsyncThunk(
	"email/sendResetPasswordOTP",
	async (credentials: { email: string }, { rejectWithValue }) => {
		try {
			const res = await axios.post(
				"/email/sendResetPasswordOTP",
				credentials
			);
			return res.data;
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data?.message || "OTP sent failed"
			);
		}
	}
);

// 🔁 Verify OTP
export const verifyOTP = createAsyncThunk(
	"auth/verifyOTP",
	async (
		credentials: { email: string; otp: number },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post("/auth/verifyOTP", credentials);
			return res.data;
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data?.message || "OTP verify failed"
			);
		}
	}
);

// 🔐 change password
export const changePasswordByEmailAndOTP = createAsyncThunk(
	"auth/changePasswordByEmailAndOTP",
	async (
		credentials: { email: string; password: string; otp: number | null },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post(
				"/auth/changePasswordByEmailAndOTP",
				credentials
			);
			return res.data;
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data?.message || "Change password failed"
			);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.error = null;
			state.loading = false;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.message = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// Restore session
			.addCase(checkIsLoggedIn.pending, (state) => {
				state.loading = true;
				state.message = null;
				state.initialized = false;
			})
			.addCase(checkIsLoggedIn.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload?.user;
				state.initialized = true;
			})
			.addCase(checkIsLoggedIn.rejected, (state) => {
				state.loading = false;
				state.user = null;
				state.initialized = true;
			})

			// Send Reset Password OTP
			.addCase(sendResetPasswordOTP.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.message = null;
			})
			.addCase(sendResetPasswordOTP.fulfilled, (state, action) => {
				state.loading = false;
				state.isResetPasswordOTPSent = action.payload?.data;
				state.message = action.payload?.message;
			})
			.addCase(sendResetPasswordOTP.rejected, (state, action) => {
				state.loading = false;
				state.isResetPasswordOTPSent = false;
				state.error = action.payload as string;
			})

			// Verify OTP
			.addCase(verifyOTP.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.message = null;
			})
			.addCase(verifyOTP.fulfilled, (state, action) => {
				state.loading = false;
				state.isResetPasswordOTPSent = action.payload?.data;
				state.message = action.payload?.message;
			})
			.addCase(verifyOTP.rejected, (state, action) => {
				state.loading = false;
				state.isResetPasswordOTPSent = false;
				state.error = action.payload as string;
			})

			// Change Password By Email And OTP
			.addCase(changePasswordByEmailAndOTP.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.message = null;
			})
			.addCase(changePasswordByEmailAndOTP.fulfilled, (state, action) => {
				state.loading = false;
				state.isPasswordChanged = action.payload?.data;
				state.message = action.payload?.message;
			})
			.addCase(changePasswordByEmailAndOTP.rejected, (state, action) => {
				state.loading = false;
				state.isPasswordChanged = false;
				state.error = action.payload as string;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
