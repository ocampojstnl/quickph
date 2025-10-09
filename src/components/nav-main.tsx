"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { HousePlus, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import MessageNotificationBadge from "./MessageNotificationBadge"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem className="cursor-pointer">
            <Link href="/landlord/create">
                <SidebarMenuButton tooltip="Create a new unit">
                    <HousePlus color="#000000" strokeWidth={1.5} />
                    <span>Create a Unit</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem className="cursor-pointer">
            <Link href="/landlord/listings">
                <SidebarMenuButton tooltip="Create a new unit">
                    <HousePlus color="#000000" strokeWidth={1.5} />
                    <span>Listings</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
