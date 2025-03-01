import { ThemeProvider } from "@/components/ui/theme-provider"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import HomePage from "./Pages/HomePage"
import ProfilePage from "./Pages/ProfilePage"
import PostInfo from "./Pages/PostInfoPage"
import EditPostPage from "./Pages/EditPostPage"
import LoginPage from "./Pages/LoginPage"
import SignUpPage from "./Pages/SignUpPage"
import { FC, useEffect } from "react"
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import EmailVerifyPage from "./Pages/EmailVerifyPage";


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
        <Route path="/email-verification" element={<EmailVerifyPage/>} />
      </Routes>
      </div>
      </Router>
      <Toaster position="top-center"
              toastOptions={{
                style: {
                  backgroundColor: '#09090B', 
                  color: '#fff', 
                  padding: '5px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  border: '1px solid #27272A',  
                },
                success: {
                  style: {
                    backgroundColor: '#001F10',
                    color: '#5AF2A6', 
                  },
                },
                error: {
                  style: {
                    backgroundColor: '#2D0608',
                    color: '#FE9EA1', 
                  },
                },
                loading: {
                  style: {
                    backgroundColor: '#f0ad4e', 
                    color: '#fff', 
                  },
                },
              }}/>
    </ThemeProvider>
  )
}

export default App
