
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Il nome del prodotto è richiesto'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  customCategory: z.string().optional(),
  price: z.coerce.number().min(0, 'Il prezzo deve essere maggiore o uguale a 0'),
  costPrice: z.coerce.number().min(0, 'Il prezzo di costo deve essere maggiore o uguale a 0').optional(),
  stockQuantity: z.coerce.number().int().min(0, 'La quantità deve essere un intero positivo'),
  lowStockThreshold: z.coerce.number().int().min(0, 'La soglia di scorta minima deve essere un intero positivo').optional(),
  size: z.string().optional(),
  weight: z.coerce.number().min(0).optional(),
  volume: z.string().optional(),
  format: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
