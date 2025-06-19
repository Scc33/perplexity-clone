export default function ChatSkeleton() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar skeleton */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 hidden lg:block">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="h-10 bg-gray-700 rounded mb-4 animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-700 rounded mb-2 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main area skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="border-b border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="lg:hidden w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-700 rounded w-48 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages area skeleton */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mb-6 animate-pulse"></div>

            {/* Suggestion buttons skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Input skeleton */}
        <div className="p-4 border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="w-full h-14 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
