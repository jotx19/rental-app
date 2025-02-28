import { ThemeProvider } from "@/components/ui/theme-provider"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import HomePage from "./Pages/HomePage"
import ProfilePage from "./Pages/ProfilePage"
import PostInfo from "./Pages/PostInfoPage"
import EditPostPage from "./Pages/EditPostPage"
import LoginPage from "./Pages/LoginPage"
import SignUpPage from "./Pages/SignUpPage"
import SettingPage from "./Pages/SettingPage"
import { FC, useEffect } from "react"
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

const App: FC = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className='flex h-screen justify-center items-center'>
        <Loader className='size-10 text-white animate-spin' />
      </div>
    );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
      <div className="font-custom">
        <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post-info" element={<PostInfo />} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to='/login'/>} />
        <Route path="/edit-post" element={authUser ? <EditPostPage /> : <Navigate to='/login'/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/setting" element={authUser ? <SettingPage /> : <Navigate to='/login'/>} />
      </Routes>
      </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
