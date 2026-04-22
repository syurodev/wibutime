"use client"

import { SettingsIcon, UserIcon } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { PasskeyLab } from "@/features/auth/components/passkey-lab"

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="text-sm font-semibold">WibuTime</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/profile">
                      <UserIcon />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/settings">
                      <SettingsIcon />
                      <span>Passkeys</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          {/* <Separator orientation="vertical" className="h-6" /> */}
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">Settings</div>
            <div className="truncate text-xs text-muted-foreground">
              Passkey testing
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <PasskeyLab />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
