import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';

interface authUser {
    id: string;       
    name: string;     
    email: string;    
    verified: boolean; 
    otp?: string;      
    otpExpiry?: Date; 
}


interface AuthState {
    authUser: authUser | null;
    isSigningIn: boolean,
    isLoggingIn: boolean,
    isUpdatingProfile: boolean,
    isCheckingAuth: boolean,
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningIn: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
  
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get<authUser>("/auth/checkauth");
        set({ authUser: res.data });
      } catch (error) {
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },
  }));