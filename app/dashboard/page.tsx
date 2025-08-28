import AddNewRecord from '@/components/AddNewRecord';
import AIInsights from '@/components/AIInsights';
import ExpenseStats from '@/components/ExpenseStats';
import Guest from '@/components/Guest';
import RecordChart from '@/components/RecordChart';
import RecordHistory from '@/components/RecordHistory';
import UserInfoSkeleton from '@/components/skeletons/UserInfoSkeleton';
import UserInfo from '@/components/UserInfo';
import { Suspense } from 'react';

export default async function Dashboard() {
  return (
    <main className='bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300'>
      {/* Mobile-optimized container with responsive padding */}
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8'>
        {/* Mobile-first responsive grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          {/* Left Column - Stacked on mobile */}
          <div className='space-y-4 sm:space-y-6'>
            {/* Welcome section with improved mobile layout */}
            {
              <Suspense fallback={<UserInfoSkeleton/>}>
                <UserInfo/>
              </Suspense>
            }
            {/* Add New Expense */}
            <AddNewRecord />
          </div>

          {/* Right Column - Stacked below on mobile */}
          <div className='space-y-4 sm:space-y-6'>
            {/* Expense Analytics */}
            <RecordChart />
            <ExpenseStats />
          </div>
        </div>

        {/* Full-width sections below - mobile-friendly spacing */}
        <div className='mt-6 sm:mt-8 space-y-4 sm:space-y-6'>
          <AIInsights />
          <RecordHistory />
        </div>
      </div>
    </main>
  );
}