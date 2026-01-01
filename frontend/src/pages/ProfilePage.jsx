import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleNameUpdate = async () => {
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    if (fullName === authUser?.fullName) {
      setIsEditingName(false);
      return;
    }

    await updateProfile({ fullName: fullName.trim() });
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setFullName(authUser?.fullName || "");
    setIsEditingName(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  bg-blue-600 hover:bg-blue-700 hover:scale-105
                  p-3 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {isUpdatingProfile && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-4 animate-pulse">
                Updating profile...
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditingName || isUpdatingProfile}
                />
                {!isEditingName ? (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setIsEditingName(true)}
                    disabled={isUpdatingProfile}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNameUpdate}
                      disabled={isUpdatingProfile}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCancelEdit}
                      disabled={isUpdatingProfile}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                value={authUser?.email || ""}
                disabled
              />
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Account Created</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(authUser?.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(authUser?.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the camera icon to update your profile picture or edit button to change your name
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;