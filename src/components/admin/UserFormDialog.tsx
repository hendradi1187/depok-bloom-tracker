import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { User } from "@/types/api"
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers"
import { toast } from "sonner"

const createSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "officer", "public"]),
})

const editSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  role: z.enum(["admin", "officer", "public"]),
  is_active: z.boolean(),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

const ROLE_LABELS = {
  admin: "Admin (akses penuh)",
  officer: "Petugas (scan & lihat)",
  public: "Publik (lihat saja)",
}

export default function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = !!user
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "", password: "", role: "officer" },
  })

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: "", role: "officer", is_active: true },
  })

  useEffect(() => {
    if (!open) return
    if (user) {
      editForm.reset({ name: user.name, role: user.role, is_active: user.is_active })
    } else {
      createForm.reset({ name: "", email: "", password: "", role: "officer" })
    }
  }, [open, user])

  const isPending = createUser.isPending || updateUser.isPending

  const onCreateSubmit = (values: CreateValues) => {
    createUser.mutate(values, {
      onSuccess: () => {
        toast.success(`Pengguna "${values.name}" berhasil ditambahkan`)
        onOpenChange(false)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  const onEditSubmit = (values: EditValues) => {
    updateUser.mutate({ id: user!.id, data: values }, {
      onSuccess: () => {
        toast.success(`Pengguna "${values.name}" berhasil diperbarui`)
        onOpenChange(false)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Perbarui data pengguna." : "Buat akun pengguna baru."}
          </DialogDescription>
        </DialogHeader>

        {!isEdit ? (
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField control={createForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama *</FormLabel>
                  <FormControl><Input placeholder="Budi Santoso" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={createForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl><Input type="email" placeholder="budi@depok.go.id" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={createForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl><Input type="password" placeholder="min. 6 karakter" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={createForm.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter className="gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Batal</Button>
                <Button type="submit" className="bg-gradient-primary text-primary-foreground" disabled={isPending}>
                  {isPending ? "Menambahkan..." : "Tambah Pengguna"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="is_active" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <div>
                      <FormLabel className="text-sm font-medium">Status Aktif</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">Nonaktifkan untuk memblokir akses</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter className="gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Batal</Button>
                <Button type="submit" className="bg-gradient-primary text-primary-foreground" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
