
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ExpenseFormValues } from "../../schemas/expenseSchema";

interface ExpenseTypeFieldsProps {
  form: UseFormReturn<ExpenseFormValues>;
}

export const ExpenseTypeFields: React.FC<ExpenseTypeFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
