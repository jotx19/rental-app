import { axiosInstance } from '@/lib/axios';
import {toast} from 'sonner';
import { create } from 'zustand';
import { AxiosError } from 'axios';

interface authUser {
    _id: string;       
    name: string;     
    email: string;    
    verified: boolean; 
}

interface AuthState {
    authUser: authUser | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    isSendingEmailVerification: boolean;  
    emailVerificationSent: boolean; 
    checkAuth: () => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    verify: (email: string, otp: string) => Promise<void>;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    sendEmailVerification: (email: string) => Promise<void>; 
    logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isSendingEmailVerification: false,
  emailVerificationSent: false,
  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<authUser>("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<authUser>("/auth/signup", data);
      toast.success("Account created successfully");
      set({ authUser: res.data });
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response?.data as { message: string })?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<authUser>("/auth/login", data);
      toast.success("Logged in successfully");
      set({ authUser: res.data });
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response?.data as { message: string })?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  verify: async (email: string, otp: string) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      toast.success(res.data.message);
      set({ authUser: res.data.user });
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response?.data as { message: string })?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  },

  sendEmailVerification: async (email: string) => {
    try {
      const res = await axiosInstance.post("/auth/email-verification", { email });
      toast.success(res.data.message);
      set({ emailVerificationSent: true });
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response?.data as { message: string })?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  },

  logout: async()=>{
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response?.data as { message: string })?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  }
}));
