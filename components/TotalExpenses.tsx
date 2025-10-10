'use client';
import getRecords from '@/app/actions/getRecords';
import getTotalExpenses from '@/app/actions/getTotalExpense';
import { useEffect, useState } from 'react';

// Skeleton loader component for TotalExpenses
export const TotalExpensesSkeleton = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 animate-pulse">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl shadow-lg" />
            <div>
                <div className="h-3 w-32 sm:w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-2 w-40 sm:w-72 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
        </div>
        <div className="h-24 sm:h-36 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
        <div className="flex gap-2 sm:gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
        </div>
    </div>
);

// Main TotalExpenses component
const TotalExpenses = () => {

    const [loading, setLoading] = useState(false);
    type ExpenseKey = 'year' | 'monthly' | 'daily';
    const TAB_OPTIONS: { label: string; key: ExpenseKey; icon: string }[] = [
        { label: 'Year', key: 'year', icon: '📈' },
        { label: 'Month Wise', key: 'monthly', icon: '📅' },
        { label: 'Day Wise', key: 'daily', icon: '📜' },
    ];

    async function LoadRecords() {
        setLoading(true);
        try {
            const { records, daily, monthly, yearly, error } = await getTotalExpenses();
            console.log(records, error);
            const totalExpense = records?.reduce((acc, record) => acc + record.amount, 0) || 0;
            console.log('Total Expense:', totalExpense);
            const totalDailyExpense = daily?.reduce((acc, record) => acc + record.amount, 0) || 0;
            console.log('Total Daily Expense:', totalDailyExpense);
            const totalMonthlyExpense = monthly?.reduce((acc, record) => acc + record.amount, 0) || 0;
            console.log('Total Monthly Expense:', totalMonthlyExpense);
            const totalYearlyExpense = yearly?.reduce((acc, record) => acc + record.amount, 0) || 0;
            console.log('Total Yearly Expense:', totalYearlyExpense);
            setexpenseAmount({
                year: totalYearlyExpense,
                monthly: totalMonthlyExpense,
                daily: totalDailyExpense
            })

        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    }
    const [activeTab, setActiveTab] = useState<ExpenseKey>('year');
    const [expenseAmounts, setexpenseAmount] = useState({
        year: 0,
        monthly: 0,
        daily: 0,
    });
    useEffect(() => {
        LoadRecords();
    }, [])

    if (loading) {
        return <TotalExpensesSkeleton />;
    }

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-200">

            {/* Title and Icon */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm sm:text-lg">💰</span>
                </div>
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        Total Expenses
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        View your year, monthly, and daily spending
                    </p>
                </div>
            </div>
            <div className='md:flex md:gap-6'>
                {/* Expense Data */}
                <div className="flex-col items-center md:w-full md:flex sm:flex-col gap-4 sm:gap-8 justify-center mb-4 py-4 px-4 sm:px-8 bg-gradient-to-r from-emerald-50/70 to-green-50/70 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100  flex items-center gap-2">
                        <span>{TAB_OPTIONS.find((t) => t.key === activeTab)?.icon}</span>
                        <span>
                            {expenseAmounts[activeTab]}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {activeTab === 'year' && 'All-time expense total'}
                        {activeTab === 'monthly' && 'Expense for current month'}
                        {activeTab === 'daily' && 'Expense for today'}
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex md:flex-col gap-2 sm:gap-4 mb-8 text-nowrap">
                    {TAB_OPTIONS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 sm:px-4 px-2 py-2 rounded-xl font-semibold md:text-sm text-xs shadow-md transition-all duration-200 focus:outline-none
              ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white'
                                    : 'bg-white/80 dark:bg-gray-800/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                }
            `}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TotalExpenses;
