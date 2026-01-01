import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed w-full top-0 z-40
      backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 shadow-sm"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center 
                group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-all">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Chatly</h1>
            </Link>
          </div>


          <div className="flex items-center gap-3">
            {authUser && (
              <>
                <Link 
                  to={"/profile"} 
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium
                    text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white
                    dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button 
                  onClick={logout}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium
                    text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300
                    dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;