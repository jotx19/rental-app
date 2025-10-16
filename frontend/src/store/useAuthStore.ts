import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

// --- Types ---
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  profilepic?: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  isSendingEmailVerification: boolean;
  emailVerificationSent: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<AuthUser | null>;
  verify: (email: string, otp: string) => Promise<void>;
  sendEmailVerification: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

// --- Store ---
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isSendingEmailVerification: false,
  emailVerificationSent: false,

  // --- Check Auth ---
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>("/auth/check");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // --- Signup ---
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<{ token: string; _id: string; name: string; email: string; profilepic?: string }>("/auth/signup", data);

      localStorage.setItem("jwt", res.data.token);
      set({
        authUser: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilepic: res.data.profilepic,
        },
      });

      toast.success("Account created successfully");
    } catch {
      toast.error("Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // --- Login ---
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<{ message: string; token: string; _id: string; name: string; email: string; profilepic?: string }>("/auth/login", data);

      localStorage.setItem("jwt", res.data.token);
      set({
        authUser: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilepic: res.data.profilepic,
        },
      });

      toast.success(res.data.message || "Logged in successfully");
      return {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        profilepic: res.data.profilepic,
      };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return null;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // --- Verify OTP ---
  verify: async (email, otp) => {
    try {
      const res = await axiosInstance.post<{ message: string; token: string; _id: string; name: string; email: string; profilepic?: string }>("/auth/verify-otp", { email, otp });

      localStorage.setItem("jwt", res.data.token);
      set({
        authUser: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilepic: res.data.profilepic,
        },
      });

      toast.success(res.data.message || "Email verified successfully!");
    } catch {
      toast.error("Invalid OTP");
    }
  },

  // --- Send Email Verification ---
  sendEmailVerification: async (email) => {
    set({ isSendingEmailVerification: true });
    try {
      const res = await axiosInstance.post<{ message: string }>("/auth/email-verification", { email });
      toast.success(res.data.message);
      set({ emailVerificationSent: true });
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      set({ isSendingEmailVerification: false });
    }
  },

  // --- Logout ---
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("jwt");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  },

  // --- Update Profile ---
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put<AuthUser>("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
