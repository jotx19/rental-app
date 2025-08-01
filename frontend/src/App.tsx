import { ThemeProvider } from "@/components/ui/theme-provider";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";  
import { FC } from "react";
import { Toaster } from "sonner";

import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import EmailVerifyPage from "./Pages/EmailVerifyPage";
import NewPostPage from "./Pages/NewPostPage";
import PostPage from "./Pages/PostPage";
import User from "./Pages/User";
import SearchPage from "./Pages/SearchPage";
import About from "./components/Sider/about";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";

useAuthStore.getState().checkAuth();

const AppContent: FC = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const location = useLocation();

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // if (isCheckingAuth && !authUser) {
  //   return (
  //     <div className="flex h-screen justify-center items-center">
  //       <Loader className="size-10 text-white animate-spin" />
  //     </div>
  //   );
  // }

  const hideNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="font-custom">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/post-page/:postId" element={<PostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/new-post" element={authUser ? <NewPostPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/email-verification" element={<EmailVerifyPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

const App: FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="mt-16 lg:mt-0">
        <AppContent />
      </div>
        <Toaster position="bottom-right"/>
    </ThemeProvider>
  );
};

export default App;
