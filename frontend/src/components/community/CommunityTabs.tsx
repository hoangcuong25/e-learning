"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import CreatePostDialog from "./CreatePostDialog";

export default function CommunityTabs() {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "explore";

  const changeView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`/community?${params.toString()}`);
  };

  const handleSearch = () => {
    const keyword = window.prompt("Nhập từ khóa tìm kiếm bài viết");
    if (keyword === null) return;

    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set("q", keyword.trim());
    } else {
      params.delete("q");
    }

    router.push(`/community?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4 sticky top-24">
      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <Tabs value={currentView} orientation="vertical" className="w-full">
          <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1">
            <TabsTrigger
              value="explore"
              onClick={() => changeView("explore")}
              className="
                justify-start w-full
                px-4 py-2
                text-left
                data-[state=active]:bg-blue-50
                data-[state=active]:text-blue-600
                data-[state=active]:font-semibold
                rounded-lg
              "
            >
              Khám phá
            </TabsTrigger>

            <TabsTrigger
              value="my_posts"
              onClick={() => changeView("my_posts")}
              className="
                justify-start w-full
                px-4 py-2
                text-left
                data-[state=active]:bg-blue-50
                data-[state=active]:text-blue-600
                data-[state=active]:font-semibold
                rounded-lg
              "
            >
              Bài viết của tôi
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Search icon only */}
          <Button
            onClick={handleSearch}
            className="
                flex items-center gap-2 justify-start
                bg-blue-600 text-white
                hover:bg-blue-700
                border-blue-600
              "
          >
            <Search size={16} />
            Tìm kiếm
          </Button>

          <Button
            onClick={() => setOpenCreatePost(true)}
            className="
                flex items-center gap-2 justify-start
                bg-blue-600 text-white
                hover:bg-blue-700
                border-blue-600
              "
          >
            <Plus size={16} />
            Tạo bài viết
          </Button>

          <CreatePostDialog
            open={openCreatePost}
            onOpenChange={setOpenCreatePost}
          />
        </div>
      </div>
    </div>
  );
}
