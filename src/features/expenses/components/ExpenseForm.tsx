
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Expense } from '../types';
import { expenseSchema, ExpenseFormValues } from '../schemas/expenseSchema';
import { ExpenseBasicFields } from './expense-form/ExpenseBasicFields';
import { ExpenseTypeFields } from './expense-form/ExpenseTypeFields';
import { ExpenseDescriptionField } from './expense-form/ExpenseDescriptionField';

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  defaultValues?: Partial<Expense>;
  salonId: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  defaultValues = {
    name: "",
    category: "fixed" as const,
    amount: 0,
    frequency: "monthly" as const,
    date: new Date().toISOString().slice(0, 10),
    description: "",
  },
  salonId,
}) => {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  const handleSubmit = (data: ExpenseFormValues) => {
    // Explicitly include all required fields to satisfy TypeScript
    onSubmit({
      name: data.name,
      category: data.category,
      amount: data.amount,
      frequency: data.frequency,
      date: data.date,
      description: data.description || "",
      salonId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpenseBasicFields form={form} />
          <ExpenseTypeFields form={form} />
        </div>
        
        <ExpenseDescriptionField form={form} />

        <Button type="submit">Salva</Button>
      </form>
    </Form>
  );
};
