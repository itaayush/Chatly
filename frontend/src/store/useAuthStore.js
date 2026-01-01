import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore.js";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null, isCheckingAuth: false });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },


connectSocket: () => {
  const { authUser } = get();
  if (!authUser) return;

  
  const existingSocket = get().socket;
  if (existingSocket?.connected) {
    existingSocket.disconnect();
  }

  const socket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
  });

  set({ socket: socket });

  socket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

  const handleBeforeUnload = () => {
    socket.disconnect();
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  
  
  socket.on("disconnect", () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  socket.on("userStatusUpdate", ({ userId, lastSeen, isOnline }) => {
    const users = useChatStore.getState().users;
    const updatedUsers = users.map(user => 
      user._id === userId ? { ...user, lastSeen, isOnline } : user
    );
    useChatStore.setState({ users: updatedUsers });
    
    const selectedUser = useChatStore.getState().selectedUser;
    if (selectedUser?._id === userId) {
      useChatStore.setState({ 
        selectedUser: { ...selectedUser, lastSeen, isOnline } 
      });
    }
  });
},

disconnectSocket: () => {
  const socket = get().socket;
  if (socket?.connected) {
    socket.disconnect();
  }
  set({ socket: null, onlineUsers: [] });
},
}));
