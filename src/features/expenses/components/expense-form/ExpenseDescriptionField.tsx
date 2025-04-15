
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ExpenseFormValues } from "../../schemas/expenseSchema";

interface ExpenseDescriptionFieldProps {
  form: UseFormReturn<ExpenseFormValues>;
}

export const ExpenseDescriptionField: React.FC<ExpenseDescriptionFieldProps> = ({ form }) => {
  return (
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
  );
};
