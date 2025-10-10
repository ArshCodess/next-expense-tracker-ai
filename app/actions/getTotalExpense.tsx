'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Record } from '@/types/Record';

async function getTotalExpenses(): Promise<{
    records?: Record[];
    daily?: Record[];
    monthly?: Record[];
    yearly?: Record[];
    error?: string;
}> {
    const { userId } = await auth();

    if (!userId) {
        return { error: 'User not found' };
    }

    try {
        const records = await db.records.findMany({
            where: { userId },
            orderBy: {
                date: 'desc', // Sort by the `date` field in descending order
            },
        });

        const today = new Date();
        const todayDateStr = today.toDateString();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        const daily = records.filter(record => new Date(record.date).toDateString() === todayDateStr);

        const monthly = records.filter(record => {
            const date = new Date(record.date);
            return date.getMonth() === todayMonth && date.getFullYear() === todayYear;
        });

        const yearly = records.filter(record => new Date(record.date).getFullYear() === todayYear);

        return { records, daily, monthly, yearly };
    } catch (error) {
        console.error('Error fetching records:', error); // Log the error
        return { error: 'Database error' };
    }
}

export default getTotalExpenses;
