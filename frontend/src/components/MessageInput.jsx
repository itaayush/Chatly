import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Video, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [videoPreviews, setVideoPreviews] = useState([]); 
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); 
    
    if (files.length + imagePreviews.length > 10) {
      toast.error("You can only upload up to 10 images at once");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select only image files");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]); 
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files); 
    
    if (files.length + videoPreviews.length > 5) {
      toast.error("You can only upload up to 5 videos at once");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select only video files");
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Video file size should be less than 100MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews((prev) => [...prev, reader.result]); 
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => { 
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => { 
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && imagePreviews.length === 0 && videoPreviews.length === 0) return;

    try {
      await sendMessage({
        text: text.trim(),
        images: imagePreviews, 
        videos: videoPreviews, 
      });

      setText("");
      setImagePreviews([]); 
      setVideoPreviews([]); 
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">

      
      {imagePreviews.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {imagePreviews.map((preview, index) => (
            <div key={`img-${index}`} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-gray-700"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-300
                flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      
      {videoPreviews.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {videoPreviews.map((preview, index) => (
            <div key={`vid-${index}`} className="relative">
              <video
                src={preview}
                className="w-40 h-32 object-cover rounded-lg border border-gray-700"
                controls
              />
              <button
                onClick={() => removeVideo(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-300
                flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            multiple 
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <input
            type="file"
            accept="video/*"
            multiple 
            className="hidden"
            ref={videoInputRef}
            onChange={handleVideoChange}
          />

          <button
            type="button"
            className={`hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                     ${imagePreviews.length > 0 ? "text-green-500" : "text-gray-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <button
            type="button"
            className={`hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                     ${videoPreviews.length > 0 ? "text-green-500" : "text-gray-400"}`}
            onClick={() => videoInputRef.current?.click()}
          >
            <Video size={20} />
          </button>
        </div>
        
        <button
          type="submit"
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text.trim() && imagePreviews.length === 0 && videoPreviews.length === 0}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;