import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

interface User {
    email: string;
    password: string;
    name: string;
    lastLogin?: Date;
    isVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    message?: string;
    signup: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    checkAuth: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
  }

export const useAuthStore = create<AuthState>((set) => ({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,

    signup: async(email, password, name) => {
        set({ isLoading:true, error:null });
        try {
            const response = await axios.post(`${API_URL}/signup`,{ email,password,name });
            set({ user:response.data.user, isAuthenticated:true, isLoading:false });
        } catch (error) {
            set({ error: "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
            set({ error: "Error logging in", isLoading: false });
            throw error;
		}
	},

    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
    },

    verifyEmail: async(code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            console.log(error);
            set({ error: "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async() => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            console.log(error);
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
            throw error;
        }
    },

    forgotPassword: async(email) => {
        set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
            set({ error: "Error sending reset password email", isLoading: false });
            throw error;
		}
    },

    resetPassword: async(token, password) => {
        set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
            set({ error: "Error resetting password", isLoading: false });
            throw error;
		}
    }
}));