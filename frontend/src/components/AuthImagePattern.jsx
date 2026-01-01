const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-blue-100 dark:bg-blue-900/40 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
