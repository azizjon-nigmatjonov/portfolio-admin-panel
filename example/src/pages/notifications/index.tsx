import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/data/mock/notifications";
import { AlertTriangle, CheckCircle2, Info, XCircle, Bell, Check } from "lucide-react";

const typeConfig = {
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  error: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
} as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1.5 text-sm">
          <Bell className="h-3.5 w-3.5" />
          {unreadCount} unread
        </Badge>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={markAllRead}>
            <Check className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;
          return (
            <Card
              key={notification.id}
              className={`cursor-pointer border-border/50 transition-colors hover:bg-muted/30 ${
                !notification.read ? "border-l-2 border-l-primary" : ""
              }`}
              onClick={() => markRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`text-sm font-medium ${
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {notification.title}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
