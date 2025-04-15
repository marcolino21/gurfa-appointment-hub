
import { z } from "zod";

export const expenseSchema = z.object({
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

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
