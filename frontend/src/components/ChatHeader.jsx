import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState, useEffect } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const isOnline = onlineUsers.includes(selectedUser._id);
 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

 
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Online";
    
    const now = currentTime;
    const lastSeenDate = new Date(lastSeen).getTime();
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Last seen just now";
    if (diffMins === 1) return "Last seen 1 minute ago";
    if (diffMins < 60) return `Last seen ${diffMins} minutes ago`;
    if (diffHours === 1) return "Last seen 1 hour ago";
    if (diffHours < 24) return `Last seen ${diffHours} hours ago`;
    if (diffDays === 1) return "Last seen yesterday";
    if (diffDays < 7) return `Last seen ${diffDays} days ago`;
    

    const options = { month: 'short', day: 'numeric' };
    return `Last seen ${new Date(lastSeen).toLocaleDateString(undefined, options)}`;
  };

  const getStatusText = () => {
    if (isOnline) return "Online";
    return formatLastSeen(selectedUser.lastSeen);
  };

  return (
    <div className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="relative">
            <div className="size-12 rounded-full ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-700 overflow-hidden">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="size-full object-cover"
              />
            </div>

            {isOnline && (
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedUser.fullName}
            </h3>
            <p className={`text-sm ${
              isOnline 
                ? "text-green-600 dark:text-green-400" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              {getStatusText()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button 
            onClick={() => setSelectedUser(null)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;