
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import type { Expense, Expenditure } from '@/lib/types';


export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch('/api/expenses');
      if(response.status === 401) {
        // The middleware will handle the redirect.
        setIsLoaded(true);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      const formattedExpenses = data.map((exp: any) => ({
        ...exp,
        id: exp._id,
        expenditures: exp.expenditures?.map((e: any) => ({...e, id: e._id})) || []
      }));
      setExpenses(formattedExpenses);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setExpenses([]);
    } finally {
      setIsLoaded(true);
    }
  }, [toast]);

  useEffect(() => {
    // Only fetch if data isn't loaded yet.
    if(!isLoaded) {
      fetchExpenses();
    }
  }, [fetchExpenses, isLoaded]);

  const addExpense = useCallback(async (name: string, amount: number) => {
    const tempId = `temp-${Date.now()}`;
    const newExpense: Expense = {
      id: tempId,
      _id: tempId,
      name,
      amount,
      expenditures: [],
      createdAt: new Date().toISOString(),
      userId: '', // This will be set by the server
    };

    // Optimistic update
    setExpenses(prev => [newExpense, ...prev]);
    router.push(`/expense/${tempId}`);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      const savedExpense = await response.json();
      
      // Replace temp expense with real one from server
      setExpenses(prev => prev.map(exp => (exp.id === tempId ? { ...savedExpense, id: savedExpense._id, expenditures: [] } : exp)));
      
      // Update URL without a full page reload
      if (window.location.pathname.includes(tempId)) {
        window.history.replaceState(null, '', `/expense/${savedExpense._id}`);
      }

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      // Revert optimistic update on failure
      setExpenses(prev => prev.filter(exp => exp.id !== tempId));
      router.push('/dashboard');
    }
  }, [router, toast]);

  const updateExpense = useCallback(async (id: string, updatedData: Partial<Pick<Expense, 'name' | 'amount'>>) => {
     const previousExpenses = expenses;
     // Optimistic update
     setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updatedData } : exp)));
     toast({ title: 'Success', description: 'Expense updated.' });

     try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update expense');
      const updatedExpense = await response.json();
      // Sync with server response
      setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updatedExpense, id: updatedExpense._id } : exp)));
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      // Revert on failure
      setExpenses(previousExpenses);
    }
  }, [toast, expenses]);

  const deleteExpense = useCallback(async (id: string) => {
    const previousExpenses = expenses;
    // Optimistic update
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast({ title: 'Success', description: 'Expense deleted successfully.' });

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      // Revert on failure
      setExpenses(previousExpenses);
    }
  }, [toast, expenses]);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find(exp => exp.id === id);
  }, [expenses]);
  
  const addExpenditure = useCallback(async (expenseId: string, data: Omit<Expenditure, 'id' | 'date'>) => {
    const tempId = `temp-expenditure-${Date.now()}`;
    const newExpenditure: Expenditure = {
        ...data,
        id: tempId,
        _id: tempId,
        date: new Date().toISOString(),
    };

    const previousExpenses = expenses;
    // Optimistic update
    setExpenses(prev =>
        prev.map(exp => {
            if (exp.id === expenseId) {
                const updatedExpenditures = [newExpenditure, ...(exp.expenditures || [])];
                return { ...exp, expenditures: updatedExpenditures };
            }
            return exp;
        })
    );

    try {
        const response = await fetch(`/api/expenses/${expenseId}/expenditures`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to add expenditure');
        const savedExpenditure = await response.json();

        // Replace temp expenditure with saved one
        setExpenses(prev =>
            prev.map(exp => {
                if (exp.id === expenseId) {
                    const updatedExpenditures = exp.expenditures.map(e => e.id === tempId ? {...savedExpenditure, id: savedExpenditure._id} : e);
                    return { ...exp, expenditures: updatedExpenditures };
                }
                return exp;
            })
        );
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        // Revert on failure
        setExpenses(previousExpenses);
    }
}, [toast, expenses]);


  const updateExpenditure = useCallback(async (expenseId: string, expenditureId: string, updatedData: Partial<Omit<Expenditure, 'id' | 'date'>>) => {
    const previousExpenses = expenses;
    // Optimistic update
    setExpenses(prev =>
        prev.map(exp => {
            if (exp.id === expenseId) {
                const newExpenditures = exp.expenditures.map(expen =>
                    (expen._id || expen.id) === expenditureId ? { ...expen, ...updatedData, id: expen.id, _id: expen._id } : expen
                );
                return {...exp, expenditures: newExpenditures};
            }
            return exp;
        })
    );
    toast({title: 'Success', description: 'Expenditure updated.'});
    
    try {
        const response = await fetch(`/api/expenses/${expenseId}/expenditures/${expenditureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Failed to update expenditure');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        // Revert on failure
        setExpenses(previousExpenses);
    }
}, [toast, expenses]);


  const deleteExpenditure = useCallback(async (expenseId: string, expenditureId: string) => {
    const previousExpenses = expenses;
    // Optimistic update
    setExpenses(prev =>
        prev.map(exp =>
            exp.id === expenseId
                ? { ...exp, expenditures: exp.expenditures.filter(expen => (expen._id || expen.id) !== expenditureId) }
                : exp
        )
    );
    toast({ title: 'Success', description: 'Expenditure deleted successfully.' });

    try {
        const response = await fetch(`/api/expenses/${expenseId}/expenditures/${expenditureId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete expenditure');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        // Revert on failure
        setExpenses(previousExpenses);
    }
  }, [toast, expenses]);
  
  const getAllExpenditures = useCallback(() => {
    return expenses.flatMap(expense => 
      (expense.expenditures || []).map(expenditure => ({
        ...expenditure,
        category: expense.name
      }))
    );
  }, [expenses]);

  return {
    expenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    addExpenditure,
    updateExpenditure,
    deleteExpenditure,
    getAllExpenditures,
    refetchExpenses: fetchExpenses,
  };
}
