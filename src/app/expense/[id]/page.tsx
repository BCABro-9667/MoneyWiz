
'use client';

import ExpenseManagementClient from '@/components/ExpenseManagementClient';
import { useParams, useRouter } from 'next/navigation';
import { useExpenses } from '@/hooks/use-expenses';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Expense } from '@/lib/types';


export default function ExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getExpenseById, expenses, isLoaded: areExpensesLoaded } = useExpenses();
  
  const [expense, setExpense] = useState<Expense | undefined | null>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
        try {
            const response = await fetch(`/api/expenses/${id}`);
            if(response.status === 404) {
              setExpense(null);
              return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch expense');
            }
            const data = await response.json();
            // The API returns _id, but our components use id.
            setExpense({...data, id: data._id, expenditures: data.expenditures?.map((e: any) => ({...e, id: e._id})) || [] });
        } catch (error) {
            console.error(error);
            setExpense(null);
        } finally {
            setIsLoading(false);
        }
    };

    if (id) {
        setIsLoading(true);
        // First, try to get from the hook (local state) which is faster
        const localExpense = getExpenseById(id);
        if(localExpense) {
            setExpense(localExpense);
            setIsLoading(false);
        } else if (areExpensesLoaded) {
           // If not found in local state and the initial load is complete,
           // it means we need to fetch it directly or it doesn't exist.
           fetchExpense();
        }
    }
  }, [id, getExpenseById, areExpensesLoaded]); // Depend on areExpensesLoaded

  // This effect will run if the expense is updated in the global state (e.g., by the hook)
  useEffect(() => {
    if (id) {
        const updatedExpense = getExpenseById(id);
        if (updatedExpense) {
            setExpense(updatedExpense);
        }
    }
  }, [id, expenses, getExpenseById]);


  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <header className="bg-primary text-primary-foreground p-8 rounded-bl-[50px] rounded-br-[50px] shadow-lg relative">
            <div className="flex items-center justify-between">
                 <Skeleton className="h-8 w-48" />
                 <Skeleton className="h-10 w-44 rounded-full" />
            </div>
        </header>
        <div className="p-6 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
      </div>
    );
  }

  if (expense === null) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Expense Not Found</h1>
            <p className="text-muted-foreground mb-8">The expense you are looking for does not exist or has been deleted.</p>
            <Button onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Dashboard
            </Button>
        </div>
    );
  }

  return <ExpenseManagementClient expense={expense} />;
}
