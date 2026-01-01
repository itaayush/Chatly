import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [hovermsg, sethovermsg] = useState(null);

  const deletemsg = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
    }
  };

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <ChatHeader />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isUserMessage = message.senderId === authUser._id;
            const showAvatar = true;

            return (
              <div
                key={message._id}
                className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
                ref={index === messages.length - 1 ? messageEndRef : null}
              >
                <div className={`flex max-w-[80%] ${isUserMessage ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                  {showAvatar && (
                    <div className="flex-shrink-0">
                      <div className="size-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
                        <img
                          src={
                            isUserMessage
                              ? authUser.profilePic || "/avatar.png"
                              : selectedUser.profilePic || "/avatar.png"
                          }
                          alt="profile pic"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-4 py-3 rounded-2xl relative ${
                        isUserMessage
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                      }`}
                      onMouseEnter={() => sethovermsg(message._id)}
                      onMouseLeave={() => sethovermsg(null)}
                    >
                      {isUserMessage && hovermsg === message._id && (
                        <button
                          onClick={() => deletemsg(message._id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      {message.images && message.images.length > 0 && (
                        <div
                          className={`grid gap-2 mb-2 ${
                            message.images.length === 1
                              ? "grid-cols-1"
                              : message.images.length === 2
                              ? "grid-cols-2"
                              : "grid-cols-2"
                          }`}
                        >
                          {message.images.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt={`Image ${imgIndex + 1}`}
                              className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
                            />
                          ))}
                        </div>
                      )}

                      {message.videos && message.videos.length > 0 && (
                        <div
                          className={`grid gap-2 mb-2 ${
                            message.videos.length === 1 ? "grid-cols-1" : "grid-cols-2"
                          }`}
                        >
                          {message.videos.map((video, vidIndex) => (
                            <video
                              key={vidIndex}
                              src={video}
                              controls
                              className="max-w-full rounded-lg"
                              style={{ maxHeight: "300px" }}
                            />
                          ))}
                        </div>
                      )}

                      {message.image && !message.images && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-full rounded-lg mb-2"
                        />
                      )}

                      {message.video && !message.videos && (
                        <video
                          src={message.video}
                          controls
                          className="max-w-full rounded-lg mb-2"
                          style={{ maxHeight: "300px" }}
                        />
                      )}

                      {message.text && <p>{message.text}</p>}
                    </div>

                    <span
                      className={`text-xs text-gray-500 dark:text-gray-400 ${
                        isUserMessage ? "text-right mr-1" : "text-left ml-1"
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;