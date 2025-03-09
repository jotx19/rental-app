import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowRight, Home, Settings, User, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="font-custom text-white rounded-2xl fixed border top-2 left-1/2 transform -translate-x-1/2 w-[80vw] z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-3 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="size-9 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-200 text-primary hover:text-black"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          {authUser ? (
            <>
              <Link to="/profile" className="btn btn-sm p-2 text-primary rounded-lg hover:bg-gray-200 hover:text-black flex items-center">
                <User className="size-5 " />
              </Link>

              <button
                className="flex items-center p-1.5 rounded-lg bg-[#D2F488] text-black hover:bg-[#ff91e7] hover:scale-105 border-transparent"
                onClick={logout}
              >
                <span>Logout</span>
                <ArrowRight className="size-5 -rotate-45" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center p-1.5 border-white rounded-lg bg-white text-black hover:bg-[#ff91e7] hover:scale-105 hover:border-white"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
