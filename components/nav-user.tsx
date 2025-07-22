"use client";

import {
  IconLogout,
  IconDashboard,
  IconDotsVertical,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HomeIcon, Tv2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSignout } from "@/hooks/use-signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavUser() {
  const { data: session, isPending } = authClient.useSession();
  const handleSignOut = useSignout();
  const { isMobile } = useSidebar();

  if (isPending) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    session?.user.image ??
                    `https://avatar.vercel.sh/${session?.user.email}`
                  }
                  alt={session?.user.name}
                />
                <AvatarFallback className="rounded-lg">
                  {session?.user.name && session.user.name.length > 0
                    ? session.user.name.charAt(0).toUpperCase()
                    : session?.user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email.split("a")[0]}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {session?.user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      session?.user.image ??
                      `https://avatar.vercel.sh/${session?.user.email}`
                    }
                    alt={session?.user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {session?.user.name && session.user.name.length > 0
                      ? session.user.name.charAt(0).toUpperCase()
                      : session?.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {" "}
                    {session?.user.name && session.user.name.length > 0
                      ? session.user.name
                      : session?.user.email.split("a")[0]}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <HomeIcon />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <IconDashboard />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/courses">
                  <Tv2 />
                  Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
