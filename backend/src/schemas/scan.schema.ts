import { z } from 'zod'

export const ScanInputSchema = z.object({
  barcode: z.string().min(1),
  location: z.string().optional().default(''),
})

export const ScanQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  plant_id: z.string().optional(),
})

export const ScanStatsQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
})

export type ScanInput = z.infer<typeof ScanInputSchema>
export type ScanQuery = z.infer<typeof ScanQuerySchema>
