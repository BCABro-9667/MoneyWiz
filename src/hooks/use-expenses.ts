'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Expense, Expenditure } from '@/lib/types';
import { useRouter } from 'next/navigation';

const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    name: 'Monthly Groceries',
    amount: 25000,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    expenditures: [
      { id: 'expend-1-1', name: 'Vegetables', amount: 2000, description: 'From local market', date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() },
      { id: 'expend-1-2', name: 'Milk and Bread', amount: 500, description: 'Daily needs', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
    ],
  },
  {
    id: 'exp-2',
    name: 'Weekend Trip',
    amount: 15000,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    expenditures: [
      { id: 'expend-2-1', name: 'Fuel', amount: 3000, description: 'Full tank', date: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString() },
      { id: 'expend-2-2', name: 'Hotel Stay', amount: 7000, description: '2 nights', date: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString() },
      { id: 'expend-2-3', name: 'Food', amount: 4000, description: 'Meals for 2 days', date: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString() },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'moneywiz-expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setExpenses(JSON.parse(item));
      } else {
        setExpenses(MOCK_EXPENSES);
      }
    } catch (error) {
      console.error("Failed to load expenses from localStorage", error);
      setExpenses(MOCK_EXPENSES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
      } catch (error) {
        console.error("Failed to save expenses to localStorage", error);
      }
    }
  }, [expenses, isLoaded]);

  const addExpense = useCallback((name: string, amount: number) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      name,
      amount,
      createdAt: new Date().toISOString(),
      expenditures: [],
    };
    setExpenses(prev => [newExpense, ...prev]);
    router.push(`/expense/${newExpense.id}`);
  }, [router]);

  const updateExpense = useCallback((id: string, updatedData: Partial<Pick<Expense, 'name' | 'amount'>>) => {
    setExpenses(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, ...updatedData } : exp))
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find(exp => exp.id === id);
  }, [expenses]);

  const addExpenditure = useCallback((expenseId: string, data: Omit<Expenditure, 'id' | 'date'>) => {
    const newExpenditure: Expenditure = {
      ...data,
      id: `expend-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setExpenses(prev =>
      prev.map(exp =>
        exp.id === expenseId
          ? { ...exp, expenditures: [newExpenditure, ...exp.expenditures] }
          : exp
      )
    );
  }, []);

  const updateExpenditure = useCallback((expenseId: string, expenditureId: string, updatedData: Partial<Omit<Expenditure, 'id' | 'date'>>) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === expenseId
          ? {
              ...exp,
              expenditures: exp.expenditures.map(expen =>
                expen.id === expenditureId ? { ...expen, ...updatedData } : expen
              ),
            }
          : exp
      )
    );
  }, []);

  const deleteExpenditure = useCallback((expenseId: string, expenditureId: string) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === expenseId
          ? { ...exp, expenditures: exp.expenditures.filter(expen => expen.id !== expenditureId) }
          : exp
      )
    );
  }, []);
  
  const getAllExpenditures = useCallback(() => {
    return expenses.flatMap(expense => 
      expense.expenditures.map(expenditure => ({
        ...expenditure,
        category: expense.name // Using expense name as category
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
