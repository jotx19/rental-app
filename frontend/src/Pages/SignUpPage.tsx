import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, HomeIcon, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ name: string; email: string; password: string }>({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate(); 

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return false;
    }
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
      await signup(formData);
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full -mt-20 max-w-md px-6 py-8 rounded-lg">
        <div className="grid place-items-center text-center gap-2">
          <HomeIcon size={30} />
          <h1 className="text-lg font-semibold">Sign Up to Continue</h1>
          <p className="text-sm text-muted-foreground">
            Sign up using your name, email, and password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            className="w-full h-12"
            id="name"
            placeholder="John Doe"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

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
              className="min-w-8 "
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid mt-3">
            <Button type="submit" disabled={isSigningUp} className="w-full">
              {isSigningUp ? (
                <>
                  <Loader className="animate-spin mr-2" />
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="hover:underline text-primary">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
