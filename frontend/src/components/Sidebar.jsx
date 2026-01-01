import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesOnlineFilter = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearchQuery = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOnlineFilter && matchesSearchQuery;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-800 transition-all duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-gray-600 dark:text-gray-300" />
            <span className="font-semibold text-gray-800 dark:text-gray-200 hidden lg:block">Contacts</span>
          </div>
          <div className="hidden lg:flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{onlineUsers.length - 1} online</span>
          </div>
        </div>


        <div className="relative mb-3 hidden lg:block">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 
              border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 
              focus:ring-blue-500 dark:focus:ring-blue-600 text-sm"
          />
          <Search className="absolute left-3 top-3 size-4 text-gray-400" />
        </div>

        <div className="hidden lg:flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
              peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
              dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
              after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full py-3 px-4 flex items-center gap-3 transition-all
                  ${isSelected 
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
                  }`}
              >

                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className={`size-12 object-cover rounded-full border-2 ${
                      isSelected 
                        ? "border-blue-500 dark:border-blue-600" 
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-white dark:ring-gray-800" />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className={`font-medium truncate ${
                    isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"
                  }`}>
                    {user.fullName}
                  </div>
                  <div className={`text-sm ${
                    isOnline 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-40 px-4 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
              <Users className="size-6 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">No contacts found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {showOnlineOnly ? "No one is online right now" : "Try a different search"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;