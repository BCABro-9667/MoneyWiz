'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Expenditure } from '@/lib/types';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  amount: z.coerce.number().positive('Amount must be positive'),
});

type ExpenditureFormData = Omit<Expenditure, 'id' | 'date' | 'description'>;

interface ExpenditureFormProps {
  expenseId: string;
  onAddExpenditure: (data: Omit<Expenditure, 'id' | 'date'>) => void;
}

export default function ExpenditureForm({ onAddExpenditure }: ExpenditureFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddExpenditure({ ...values, description: '' });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-[30%]">
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 250" {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[70%]">
                <FormLabel>Expenditure Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Coffee" {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
            <Plus className="mr-2 h-4 w-4" /> Add Expenditure
          </Button>
        </div>
      </form>
    </Form>
  );
}
