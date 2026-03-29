import { useState } from "react"
import Layout from "@/components/Layout"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import AdminNav from "@/components/admin/AdminNav"
import UserFormDialog from "@/components/admin/UserFormDialog"
import { Plus, Pencil, Trash2, ShieldCheck, Shield, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useUsers, useDeleteUser } from "@/hooks/useUsers"
import { User } from "@/types/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: typeof ShieldCheck }> = {
  admin:   { label: "Admin",    color: "bg-red-100 text-red-700 border-red-200",      icon: ShieldCheck },
  officer: { label: "Petugas",  color: "bg-blue-100 text-blue-700 border-blue-200",   icon: Shield },
  public:  { label: "Publik",   color: "bg-gray-100 text-gray-600 border-gray-200",   icon: UserIcon },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminUsers() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const openCreate = () => { setEditingUser(null); setFormOpen(true) }
  const openEdit = (user: User) => { setEditingUser(user); setFormOpen(true) }

  const handleDelete = () => {
    if (!deletingUser) return
    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => {
        toast.success(`Pengguna "${deletingUser.name}" berhasil dihapus`)
        setDeletingUser(null)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <Layout>
      <div className="container py-8">
        <BreadcrumbNav />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Pengguna</h1>
            <p className="text-muted-foreground mt-1">Kelola akun dan hak akses pengguna</p>
          </div>
          <Button className="bg-gradient-primary text-primary-foreground gap-2 shadow-soft" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>

        <AdminNav />

        <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <h2 className="font-display font-semibold text-foreground">Daftar Pengguna</h2>
            <Badge variant="secondary">{users?.length ?? 0} pengguna</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Dibuat</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-44 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-20 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-5 w-16 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-7 w-16 bg-muted animate-pulse rounded ml-auto" /></td>
                  </tr>
                ))}

                {!isLoading && (users ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <p className="text-2xl mb-2">👤</p>
                      <p className="text-muted-foreground text-sm">Belum ada pengguna</p>
                    </td>
                  </tr>
                )}

                {!isLoading && (users ?? []).map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.public
                  const RoleIcon = roleCfg.icon
                  return (
                    <tr key={user.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          roleCfg.color
                        )}>
                          <RoleIcon className="h-3 w-3" />
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          user.is_active
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        )}>
                          {user.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm" variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(user)}
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm" variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeletingUser(user)}
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserFormDialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingUser(null) }} user={editingUser} />

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengguna <span className="font-semibold">"{deletingUser?.name}"</span> ({deletingUser?.email}) akan dihapus permanen.
              Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}
