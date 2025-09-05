
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
  const { getExpenseById } = useExpenses();
  
  const [expense, setExpense] = useState<Expense | undefined | null>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
        setIsLoaded(false);
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
            setExpense({...data, id: data._id});
        } catch (error) {
            console.error(error);
            setExpense(null);
        } finally {
            setIsLoaded(true);
        }
    };

    if (id) {
        // First, try to get from the hook (local state)
        const localExpense = getExpenseById(id);
        if(localExpense) {
            setExpense(localExpense);
            setIsLoaded(true);
        } else {
           // If not found, fetch from API
           fetchExpense();
        }
    }
  }, [id, getExpenseById]);


  if (!isLoaded || expense === undefined) {
    return (
      <div className="p-6 space-y-8">
        <header className="flex items-center justify-between">
           <Skeleton className="h-8 w-48" />
           <Skeleton className="h-10 w-24" />
        </header>
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
        </div>
        <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-[50px]" />
        </div>
         <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-[50px]" />
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
