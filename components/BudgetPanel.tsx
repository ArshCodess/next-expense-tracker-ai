'use client';
import { useMemo, useRef, useState } from 'react';

type BudgetStatus = 'safe' | 'warning' | 'over';

type BudgetProps = {
  initialBudget?: number;       // e.g., 2000
  currentSpent?: number;        // e.g., sum of expenses provided from parent
  onUpdateBudget?: (next: number) => void; // optional callback to lift state up
};

const formatINR = (n: number) =>
  `₹${Math.max(0, n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const getStatus = (budget: number, spent: number): BudgetStatus => {
  if (budget <= 0 && spent > 0) return 'over';
  if (spent > budget) return 'over';
  if (budget <= 0) return 'safe';
  const remaining = budget - spent;
  const ratio = remaining / budget;
  if (ratio < 0.3) return 'warning';
  return 'safe';
};

const statusConfig: Record<BudgetStatus, { label: string; badge: string }> = {
  safe: { label: 'On track', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  warning: { label: 'Running low', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  over: { label: 'Over budget', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
};

const BudgetPanel = ({
  initialBudget = 2000,
  currentSpent = 0,
  onUpdateBudget,
}: BudgetProps) => {
  const [isloading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [input, setInput] = useState<string>(String(initialBudget));
  const liveRef = useRef<HTMLDivElement>(null);

  const spent = Math.max(0, currentSpent);
  const remaining = Math.max(0, budget - spent);
  const status = getStatus(budget, spent);

  const percent = useMemo(() => {
    if (budget <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((spent / budget) * 100)));
  }, [budget, spent]);

  const handleUpdate = () => {
    const next = Math.max(0, Math.floor(Number(input) || 0));
    setBudget(next);
    onUpdateBudget?.(next);
    // Announce change to assistive tech
    if (liveRef.current) {
      liveRef.current.textContent = `Budget updated to ${formatINR(next)}. Remaining ${formatINR(Math.max(0, next - spent))}.`;
    }
  };

  const quickSet = (delta: number) => {
    const next = Math.max(0, budget + delta);
    setBudget(next);
    setInput(String(next));
    onUpdateBudget?.(next);
    if (liveRef.current) {
      liveRef.current.textContent = `Budget updated to ${formatINR(next)}. Remaining ${formatINR(Math.max(0, next - spent))}.`;
    }
  };

  if (isloading){
    return <BudgetPanelSkeleton/>
  }
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-sm sm:text-lg">💼</span>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Budget
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Set a budget and track remaining balance
          </p>
        </div>
        <span
          className={[
            'ml-auto rounded-full px-3 py-1 text-xs font-medium',
            statusConfig[status].badge,
          ].join(' ')}
        >
          {statusConfig[status].label}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-emerald-50/70 to-green-50/70 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50 p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{formatINR(budget)}</div>
        </div>
        <div className="bg-gradient-to-r from-teal-50/70 to-emerald-50/70 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50 p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spent</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{formatINR(spent)}</div>
        </div>
        <div className="bg-gradient-to-r from-green-50/70 to-teal-50/70 dark:from-green-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50 p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Remaining</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{formatINR(remaining)}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 sm:mb-6">
        <div
          className="w-full h-3 sm:h-3.5 bg-gray-200/80 dark:bg-gray-700/60 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Budget consumption"
        >
          <div
            className={[
              'h-full rounded-full transition-all duration-300',
              status === 'over'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                : status === 'warning'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                : 'bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500',
            ].join(' ')}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{percent}% used</span>
          <span>{formatINR(Math.max(0, budget - spent))} left</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide mb-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Set / Update Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">₹</span>
            <input
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-6 pr-3 py-2.5 bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200/80 dark:border-gray-600/80 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:border-emerald-400 dark:focus:border-emerald-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Enter budget (INR)"
            />
          </div>
        </div>
        <div className="flex sm:flex-col gap-2">
          <button
            type="button"
            onClick={handleUpdate}
            className="flex-1 relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-xl hover:shadow-2xl group transition-all duration-300 border-2 border-transparent hover:border-white/20 text-sm"
          >
            <span className="relative z-10">Update Budget</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => quickSet(500)}
              className="flex-1 border-2 border-emerald-500/20 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-2 rounded-xl font-semibold transition-all duration-200"
              title="+ ₹500"
            >
              + ₹500
            </button>
            <button
              type="button"
              onClick={() => quickSet(1000)}
              className="flex-1 border-2 border-emerald-500/20 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-2 rounded-xl font-semibold transition-all duration-200"
              title="+ ₹1000"
            >
              + ₹1000
            </button>
          </div>
        </div>
      </div>

      {/* Live region for announcements */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
};

export default BudgetPanel;


export const BudgetPanelSkeleton = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 animate-pulse">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 w-56 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
      <div className="ml-auto h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
    <div className="space-y-2 mb-6">
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="sm:col-span-2 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="hidden sm:block flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);
