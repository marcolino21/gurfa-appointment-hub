
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Expense } from '../types';

const expenseSchema = z.object({
  name: z.string().min(1, {
    message: "Il nome è obbligatorio",
  }),
  category: z.enum(["fixed", "variable"], {
    required_error: "Seleziona una categoria",
  }),
  amount: z.coerce.number().min(0, {
    message: "L'importo deve essere maggiore o uguale a 0",
  }),
  frequency: z.enum(["monthly", "quarterly", "annually", "one-time"], {
    required_error: "Seleziona una frequenza",
  }),
  date: z.string().min(1, {
    message: "La data è obbligatoria",
  }),
  description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome della spesa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">Costo Fisso</SelectItem>
                    <SelectItem value="variable">Costo Variabile</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleziona se è un costo fisso o variabile per la tua attività.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Importo (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequenza</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona frequenza" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Mensile</SelectItem>
                    <SelectItem value="quarterly">Trimestrale</SelectItem>
                    <SelectItem value="annually">Annuale</SelectItem>
                    <SelectItem value="one-time">Una tantum</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Con quale frequenza si ripete questa spesa?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione opzionale della spesa" 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Salva</Button>
      </form>
    </Form>
  );
};
