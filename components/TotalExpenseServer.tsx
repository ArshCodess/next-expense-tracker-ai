import getTotalExpenses from '@/app/actions/getTotalExpense';
import TotalExpenses from './TotalExpenses';
// Main TotalExpenses component
const TotalExpensesServer = async () => {
    const { records, daily, monthly, yearly, error } = await getTotalExpenses();
    const totalExpense = records?.reduce((acc, record) => acc + record.amount, 0) || 0;
    const totalDailyExpense = daily?.reduce((acc, record) => acc + record.amount, 0) || 0;
    const totalMonthlyExpense = monthly?.reduce((acc, record) => acc + record.amount, 0) || 0;
    const totalYearlyExpense = yearly?.reduce((acc, record) => acc + record.amount, 0) || 0;
    return (
        <TotalExpenses year={totalYearlyExpense} monthly={totalMonthlyExpense} daily={totalDailyExpense}
        />
    );
};

export default TotalExpensesServer;
