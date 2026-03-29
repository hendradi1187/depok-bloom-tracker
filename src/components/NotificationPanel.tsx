import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Trash2, ScanLine, Leaf, User, Edit } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification, NotificationType } from "@/types/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const notificationIcons: Record<NotificationType, typeof ScanLine> = {
  scan: ScanLine,
  plant_created: Leaf,
  plant_updated: Edit,
  plant_deleted: Trash2,
  user_created: User,
};

const notificationColors: Record<NotificationType, string> = {
  scan: "text-blue-600",
  plant_created: "text-green-600",
  plant_updated: "text-orange-600",
  plant_deleted: "text-red-600",
  user_created: "text-purple-600",
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onClear }: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];
  const color = notificationColors[notification.type];

  const content = (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-md transition-colors hover:bg-accent cursor-pointer",
        !notification.read && "bg-primary/5"
      )}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      {/* Icon */}
      <div className={cn("shrink-0 mt-0.5", color)}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground leading-tight">
            {notification.title}
          </p>
          {!notification.read && (
            <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
            locale: idLocale,
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            title="Tandai sudah dibaca"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClear(notification.id);
          }}
          title="Hapus notifikasi"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link to={notification.link} className="block group">
        {content}
      </Link>
    );
  }

  return <div className="group">{content}</div>;
}

export default function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 rounded-md hover:bg-accent"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">Notifikasi</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {unreadCount} baru
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tandai semua
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground mt-2">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tidak ada notifikasi
              </p>
              <p className="text-xs text-muted-foreground">
                Notifikasi akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onClear={clearNotification}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link to="/notifications" className="block">
                <Button
                  variant="ghost"
                  className="w-full text-xs h-8 text-primary hover:text-primary"
                >
                  Lihat semua notifikasi
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
