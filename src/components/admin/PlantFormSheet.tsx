import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plant } from "@/types/api"
import { useCategories } from "@/hooks/useCategories"
import { useCreatePlant, useUpdatePlant } from "@/hooks/usePlants"
import { toast } from "sonner"

const plantSchema = z.object({
  barcode: z
    .string()
    .min(1, "Barcode wajib diisi")
    .regex(/^DPK-[A-Z]+-\d{3}$/, "Format: DPK-XXX-000 (contoh: DPK-ORN-007)"),
  common_name: z.string().min(1, "Nama umum wajib diisi"),
  latin_name: z.string().min(1, "Nama latin wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  status: z.enum(["available", "sold", "on_display"]).default("available"),
  grade: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative("Harga tidak boleh negatif").optional().nullable(),
  description: z.string().optional().default(""),
  care_guide: z.string().optional().default(""),
  location: z.string().optional().default(""),
  supplier: z.string().optional().default(""),
  supplier_contact: z.string().optional().default(""),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
})

type PlantFormValues = z.infer<typeof plantSchema>

interface PlantFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plant?: Plant | null
}

export default function PlantFormSheet({ open, onOpenChange, plant }: PlantFormSheetProps) {
  const isEdit = !!plant
  const { data: categoriesData } = useCategories()
  const categories = categoriesData ?? []
  const createPlant = useCreatePlant()
  const updatePlant = useUpdatePlant()

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      barcode: "", common_name: "", latin_name: "", category: "",
      status: "available", grade: null, price: null,
      description: "", care_guide: "", location: "",
      supplier: "", supplier_contact: "", latitude: null, longitude: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(plant ? {
        barcode: plant.barcode,
        common_name: plant.common_name,
        latin_name: plant.latin_name,
        category: plant.category,
        status: plant.status ?? "available",
        grade: plant.grade ?? null,
        price: plant.price ?? null,
        description: plant.description ?? "",
        care_guide: plant.care_guide ?? "",
        location: plant.location ?? "",
        supplier: plant.supplier ?? "",
        supplier_contact: plant.supplier_contact ?? "",
        latitude: plant.latitude ?? null,
        longitude: plant.longitude ?? null,
      } : {
        barcode: "", common_name: "", latin_name: "", category: "",
        status: "available", grade: null, price: null,
        description: "", care_guide: "", location: "",
        supplier: "", supplier_contact: "", latitude: null, longitude: null,
      })
    }
  }, [open, plant])

  const isPending = createPlant.isPending || updatePlant.isPending

  const onSubmit = (values: PlantFormValues) => {
    const payload = { ...values, price: values.price ?? null, latitude: values.latitude ?? null, longitude: values.longitude ?? null }
    if (isEdit && plant) {
      updatePlant.mutate({ id: plant.id, data: payload }, {
        onSuccess: () => { toast.success(`"${values.common_name}" berhasil diperbarui`); onOpenChange(false) },
        onError: (err) => toast.error(err.message),
      })
    } else {
      createPlant.mutate(payload, {
        onSuccess: () => { toast.success(`"${values.common_name}" berhasil ditambahkan`); onOpenChange(false) },
        onError: (err) => toast.error(err.message),
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-xl">
            {isEdit ? "Edit Tanaman" : "Tambah Tanaman Baru"}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? "Perbarui data tanaman. Field bertanda * wajib diisi." : "Isi data tanaman baru. Field bertanda * wajib diisi."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* ── IDENTITAS ── */}
            <FormField control={form.control} name="barcode" render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode *</FormLabel>
                <FormControl>
                  <Input placeholder="DPK-ORN-007" {...field} disabled={isEdit} className="font-mono" />
                </FormControl>
                <p className="text-[11px] text-muted-foreground">Format: DPK-[KATEGORI]-[NOMOR]</p>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="common_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Umum *</FormLabel>
                  <FormControl><Input placeholder="Bougenville" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="latin_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Latin *</FormLabel>
                  <FormControl><Input placeholder="Bougainvillea sp." className="italic" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />

            {/* ── STATUS, GRADE, HARGA ── */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Informasi Jual</p>

            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">✅ Tersedia</SelectItem>
                      <SelectItem value="sold">🔴 Terjual</SelectItem>
                      <SelectItem value="on_display">🔵 Dipamerkan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="grade" render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value ?? "none"}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="–" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
                      <SelectItem value="A">⭐ Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="500000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Separator />

            {/* ── DESKRIPSI ── */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deskripsi</p>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ciri khas tanaman, keunikan, dsb..." className="resize-none" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="care_guide" render={({ field }) => (
              <FormItem>
                <FormLabel>Panduan Perawatan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Siram 2x sehari, pangkas sebulan sekali..." className="resize-none" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />

            {/* ── LOKASI & SUPPLIER ── */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lokasi & Supplier</p>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl><Input placeholder="Kec. Pancoran Mas" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="supplier" render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl><Input placeholder="Dinas Lingkungan Hidup" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="supplier_contact" render={({ field }) => (
              <FormItem>
                <FormLabel>Kontak Supplier (WA/Telepon)</FormLabel>
                <FormControl><Input placeholder="08123456789" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="latitude" render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="-6.4025" {...field} value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="longitude" render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="106.7942" {...field} value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <SheetFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Batal</Button>
              <Button type="submit" className="bg-gradient-primary text-primary-foreground" disabled={isPending}>
                {isPending ? (isEdit ? "Menyimpan..." : "Menambahkan...") : (isEdit ? "Simpan Perubahan" : "Tambah Tanaman")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
