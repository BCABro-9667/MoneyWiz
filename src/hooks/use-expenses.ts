
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
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setExpenses([]);
    } finally {
      setIsLoaded(true);
    }
  }, [toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (name: string, amount: number) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      const newExpense = await response.json();
      setExpenses(prev => [{...newExpense, id: newExpense._id}, ...prev]);
      router.push(`/expense/${newExpense._id}`);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  }, [router, toast]);

  const updateExpense = useCallback(async (id: string, updatedData: Partial<Pick<Expense, 'name' | 'amount'>>) => {
     try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update expense');
      const updatedExpense = await response.json();
      setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updatedExpense, id: updatedExpense._id } : exp)));
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  }, [toast]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast({ title: 'Success', description: 'Expense deleted successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  }, [toast]);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find(exp => exp.id === id);
  }, [expenses]);
  
  const addExpenditure = useCallback(async (expenseId: string, data: Omit<Expenditure, 'id' | 'date'>) => {
    try {
        const response = await fetch(`/api/expenses/${expenseId}/expenditures`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to add expenditure');
        const newExpenditure = await response.json();

        setExpenses(prev =>
            prev.map(exp => {
                if (exp.id === expenseId) {
                    const updatedExpenditures = [{ ...newExpenditure, id: newExpenditure._id }, ...(exp.expenditures || [])];
                    return { ...exp, expenditures: updatedExpenditures };
                }
                return exp;
            })
        );
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
}, [toast]);


  const updateExpenditure = useCallback(async (expenseId: string, expenditureId: string, updatedData: Partial<Omit<Expenditure, 'id' | 'date'>>) => {
    try {
        const response = await fetch(`/api/expenses/${expenseId}/expenditures/${expenditureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Failed to update expenditure');
        const updatedExpenditure = await response.json();

        setExpenses(prev =>
            prev.map(exp =>
                exp.id === expenseId
                    ? {
                        ...exp,
                        expenditures: exp.expenditures.map(expen =>
                            expen.id === expenditureId ? { ...expen, ...updatedExpenditure, id: updatedExpenditure._id } : expen
                        ),
                    }
                    : exp
            )
        );
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
}, [toast]);


  const deleteExpenditure = useCallback(async (expenseId: string, expenditureId: string) => {
    try {
        const response = await fetch(`/api/expenses/${expenseId}/expenditures/${expenditureId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete expenditure');
        
        setExpenses(prev =>
            prev.map(exp =>
                exp.id === expenseId
                    ? { ...exp, expenditures: exp.expenditures.filter(expen => expen.id !== expenditureId) }
                    : exp
            )
        );
        toast({ title: 'Success', description: 'Expenditure deleted successfully.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  }, [toast]);
  
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
  };
}
