import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plant } from "@/types/api"
import { useDeletePlant } from "@/hooks/usePlants"
import { useNotifications } from "@/hooks/useNotifications"
import { toast } from "sonner"

interface DeletePlantDialogProps {
  plant: Plant | null
  onOpenChange: (open: boolean) => void
}

export default function DeletePlantDialog({ plant, onOpenChange }: DeletePlantDialogProps) {
  const deletePlant = useDeletePlant()
  const { addNotification } = useNotifications()

  const handleConfirm = () => {
    if (!plant) return
    deletePlant.mutate(plant.id, {
      onSuccess: () => {
        toast.success(`"${plant.common_name}" berhasil dihapus`)
        addNotification({
          type: 'plant_deleted',
          title: 'Tanaman Dihapus',
          message: `${plant.common_name} telah dihapus dari katalog`,
          read: false,
          metadata: {
            plant_name: plant.common_name,
          },
        })
        onOpenChange(false)
      },
      onError: (err) => {
        toast.error(err.message)
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={!!plant} onOpenChange={(open) => !open && onOpenChange(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tanaman?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan menghapus{" "}
            <span className="font-semibold text-foreground">
              {plant?.common_name}
            </span>{" "}
            <span className="italic text-muted-foreground">({plant?.latin_name})</span>
            .<br />
            Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePlant.isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deletePlant.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePlant.isPending ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
