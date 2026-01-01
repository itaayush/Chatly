import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">

      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 ml-52 text-white">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <MessageSquare className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome back!</h2>
          <p className="text-xl text-white/80 text-center max-w-md">
            Sign in to continue your conversations and catch up with your messages.
          </p>
          

          <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-white/5"></div>
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5"></div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
  
          <div className="lg:hidden text-center mb-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Access your account and messages</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>


            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Create new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;