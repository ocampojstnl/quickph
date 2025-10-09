"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function MessageNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/chat/unread-count');
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
        setUnreadCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadCount();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return null;
  }

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 min-w-5 h-5 text-xs flex items-center justify-center rounded-full"
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}