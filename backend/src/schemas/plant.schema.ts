import { z } from 'zod'

export const PlantStatusEnum = z.enum(['available', 'sold', 'on_display'])

export const PlantInputSchema = z.object({
  barcode: z.string().min(1).regex(/^DPK-[A-Z]+-\d{3}$/, 'Format barcode: DPK-XXX-000').optional(), // Auto-generate jika tidak ada
  common_name: z.string().min(1),
  latin_name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional().default(''),
  care_guide: z.string().optional().default(''),
  location: z.string().optional().default(''),
  supplier: z.string().optional().default(''),
  supplier_contact: z.string().optional().default(''),
  price: z.number().int().nonnegative().optional().nullable(),
  status: PlantStatusEnum.optional().default('available'),
  grade: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  images: z.array(z.string()).optional().default([]), // Array URL gambar (relative or absolute)
})

export const PlantQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: PlantStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(20),
})

export type PlantInput = z.infer<typeof PlantInputSchema>
export type PlantQuery = z.infer<typeof PlantQuerySchema>
