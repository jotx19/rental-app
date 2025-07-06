import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowRight, Home, User, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";

const Navbar = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const { getLatestPost } = usePostStore();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isServerOnline, setIsServerOnline] = useState(false); 

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const checkServerStatus = async () => {
      const posts = await getLatestPost();
      if (Array.isArray(posts) && posts.length > 0) {
        setIsServerOnline(true);
      } else {
        setIsServerOnline(false); 
      }
    };
    checkServerStatus();
  }, [getLatestPost]);

  return (
    <header className="font-custom text-white border-b-[1px] fixed top-0 left-1/2 transform -translate-x-1/2 w-full z-20 backdrop-blur-lg bg-base-100/80">
      <div className="container h-16 px-3 mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="size-9 rounded-lg flex items-center justify-center">
            <Home className="size-6 text-primary" />
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 border rounded-full px-3">
            <span className="text-[15px] text-primary ">Server</span>
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isServerOnline ? "bg-green-500" : "bg-red-500"
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isServerOnline ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </span>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-200 text-primary hover:text-black"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          {authUser ? (
            <>
              <Link
                to="/profile"
                className="btn btn-sm p-2 text-primary rounded-lg hover:bg-gray-200 hover:text-black flex items-center"
              >
                <User className="size-4 " />
              </Link>

              <button
                className="flex items-center p-1 px-2 rounded-xl bg-[#D2F488] text-black hover:bg-[#ff91e7] hover:scale-105 border-transparent"
                onClick={logout}
              >
                <span className="">Logout</span>
                <ArrowRight className="size-5 -rotate-45" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center p-1 px-2 border-white rounded-lg bg-white text-black hover:bg-[#ff91e7] hover:scale-105 hover:border-white"
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
