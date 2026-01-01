import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-center pt-20 px-4 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-7xl h-[calc(100vh-3rem)] border border-gray-200 dark:border-gray-700">
          <div className="flex h-full rounded-xl overflow-hidden">

            <div className="w-80 border-r border-gray-200 dark:border-gray-700">
              <Sidebar />
            </div>
            
            <div className="flex-1 flex">
              {!selectedUser ? (
                <NoChatSelected />
              ) : (
                <ChatContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;