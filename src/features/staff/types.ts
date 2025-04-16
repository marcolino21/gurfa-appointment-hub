
import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  lastName: z.string().optional(),
  email: z.string().email({ message: 'Email non valida' }),
  phone: z.string().optional(),
  additionalPhone: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
  position: z.string().optional(),
  color: z.string(),
  isActive: z.boolean().default(true),
  showInCalendar: z.boolean().default(true),
  assignedServiceIds: z.array(z.string()),
  workSchedule: z.array(
    z.object({
      day: z.string(),
      isWorking: z.boolean().default(false),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional(),
    })
  ).default([
    { day: 'Lunedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Martedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Mercoledì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Giovedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Venerdì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Sabato', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Domenica', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
  ]),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

export interface WorkScheduleDay {
  day: string;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breakStart?: string;
  breakEnd?: string;
}
