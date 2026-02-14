export default function GameLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Game area skeleton */}
        <div className="flex-1 order-1 lg:order-2">
          <div className="bg-gray-200 rounded-2xl aspect-[4/3] md:aspect-[16/10] animate-pulse" />
        </div>

        {/* Info sidebar skeleton */}
        <div className="w-full lg:w-96 order-2 lg:order-1 shrink-0 space-y-6">
          {/* Breadcrumb */}
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />

          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Title */}
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Skill chart card */}
          <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="h-4 w-32 mx-auto bg-gray-200 rounded mb-4" />
            <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full" />
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="h-6 w-6 mx-auto bg-gray-200 rounded mb-1" />
                <div className="h-3 w-10 mx-auto bg-gray-200 rounded" />
              </div>
              <div className="text-center">
                <div className="h-6 w-6 mx-auto bg-gray-200 rounded mb-1" />
                <div className="h-3 w-10 mx-auto bg-gray-200 rounded" />
              </div>
              <div className="text-center">
                <div className="h-6 w-6 mx-auto bg-gray-200 rounded mb-1" />
                <div className="h-3 w-10 mx-auto bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Score type card */}
          <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
