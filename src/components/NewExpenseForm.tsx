'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Expense name must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
});

interface NewExpenseFormProps {
  onAddExpense: (name: string, amount: number) => void;
}

export default function NewExpenseForm({ onAddExpense }: NewExpenseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddExpense(values.name, values.amount);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-start md:items-end gap-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full md:w-auto">
              <FormLabel>Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5000" {...field} className="rounded-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-grow w-full">
              <FormLabel>Expense Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly Groceries" {...field} className="rounded-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded-full w-full md:w-auto" disabled={form.formState.isSubmitting}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </form>
    </Form>
  );
}
