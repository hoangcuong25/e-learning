"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchUser, logoutUser } from "@/store/slice/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react";
import SidebarAdmin from "./Sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import LoadingScreen from "@/components/LoadingScreen";

const AdminNavbar = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="h-16 border-b bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Left side - Menu & Title */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <button className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r w-72">
            <VisuallyHidden>
              <SheetTitle>Admin Menu</SheetTitle>
            </VisuallyHidden>
            <div className="h-full overflow-y-auto">
              <SidebarAdmin />
            </div>
          </SheetContent>
        </Sheet>

        <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
              <AvatarImage src={user?.avatar} alt={user?.fullname} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user?.fullname?.charAt(0)?.toUpperCase() || "I"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullname}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminNavbar;
