const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className="flex gap-2 items-end max-w-[80%]">
            <div className="size-10 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
            <div className="h-16 w-[200px] bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
