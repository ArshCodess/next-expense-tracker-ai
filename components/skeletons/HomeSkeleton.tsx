import React from 'react'

export const HomeSkeleton = () => {
  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300">
  {/* Skeleton Container */}
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
    {/* Responsive Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Left Column Skeleton */}
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 animate-pulse">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white dark:border-gray-600 shadow-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl shadow-lg"></div>
              <div className="h-6 sm:h-7 md:h-8 lg:h-10 w-32 sm:w-40 md:w-64 lg:w-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 sm:h-5 w-56 sm:w-80 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 sm:h-5 w-44 sm:w-72 bg-gray-200 dark:bg-gray-700 rounded mb-4 sm:mb-6 mx-auto sm:mx-0"></div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-start">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100 dark:border-emerald-800 px-3 py-2 rounded-xl flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg"></div>
                <div>
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-100 dark:border-green-800 px-3 py-2 rounded-xl flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"></div>
                <div>
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Add New Expense Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 animate-pulse h-32"></div>
      </div>
      {/* Right Column Skeleton */}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md h-48 animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md h-32 animate-pulse"></div>
      </div>
    </div>
    {/* Full-width Sections Below */}
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md h-40 animate-pulse"></div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md h-56 animate-pulse"></div>
    </div>
  </div>
</main>

  )
}
