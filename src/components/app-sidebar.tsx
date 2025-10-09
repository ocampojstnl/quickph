"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import NavProjects from "@/components/nav-projects"
import NavUser from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  teams: [
    {
      name: "QuickRent PH",
      logo: GalleryVerticalEnd,
      plan: "Rental App",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/landlord",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Messages",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Statistics",
          url: "#",
        },
      ],
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="pt-68px" collapsible="icon" {...props}>
      <SidebarHeader className="h-[68px]">
        {/* <Link href="/rentals">
          <TeamSwitcher teams={data.teams} />
        </Link> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
