import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon, Eye, EyeOff, HomeIcon, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      await login({ email: formData.email, password: formData.password });
      navigate("/"); // Redirect to homepage
    }
  };

  const handleVerifyWithOtp = () => {
    navigate("/email-verification"); // This will navigate to /email-verification when clicked
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full -mt-20 max-w-md px-6 py-8 rounded-lg">
        <div className="grid place-items-center text-center gap-2">
          <HomeIcon size={30} />
          <h1 className="text-lg font-semibold">Login to Continue</h1>
          <p className="text-sm text-muted-foreground">
            Log in using your email and password or email and OTP.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            className="w-full h-12"
            id="email"
            placeholder="name@domain.com"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Label htmlFor="password">Password</Label>
          <div className="flex items-center gap-2">
            <Input
              className="w-full h-12"
              id="password"
              placeholder="********"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              size="icon"
              variant="secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="min-w-8"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-4">
            <Button type="submit" disabled={isLoggingIn} className="w-full">
              {isLoggingIn ? (
                <>
                  <Loader className="animate-spin mr-2" />
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/email-verification"
              className="w-full text-[#47A8FF] hover:underline"
              onClick={handleVerifyWithOtp}
            >
              <span className="flex items-center justify-center">
                Verify with OTP <ArrowRightIcon className="ml-1" />
              </span>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground text-center mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="hover:underline text-primary">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
