"use client";

import {
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Compass,
  UserCircle,
  UserPlus,
  UserCheck,
  Plus,
  Search,
  X,
  MessageSquare,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useDebounce } from "use-debounce";
import { fetchAllPosts } from "@/store/slice/community/postSlice";
import { Button } from "@/components/ui/button";

export default function CommunitySidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "explore";
  const queryFromUrl = searchParams.get("search") || "";

  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState<
    "followers" | "following"
  >("followers");
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [isPostsOpen, setIsPostsOpen] = useState(true);
  const [isFollowingOpen, setIsFollowingOpen] = useState(true);

  const [debouncedKeyword] = useDebounce(keyword, 500);

  useEffect(() => {
    setKeyword(queryFromUrl);
    setShowSearch(!!queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const params: any = {};

    if (debouncedKeyword?.trim()) {
      params.search = debouncedKeyword.trim();
    }

    // My posts
    if (currentView === "my_posts" && user) {
      params.authorId = user.id;
    }

    dispatch(fetchAllPosts(params));

    // Sync URL (không tạo history mới)
    const urlParams = new URLSearchParams(searchParams.toString());

    if (debouncedKeyword?.trim()) {
      urlParams.set("search", debouncedKeyword.trim());
    } else {
      urlParams.delete("search");
    }

    router.replace(`/community?${urlParams.toString()}`);
  }, [debouncedKeyword, currentView, user]);

  const changeView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`/community?${params.toString()}`);
  };

  const NavItem = ({
    value,
    label,
    icon: Icon,
    onClick,
  }: {
    value: string;
    label: string;
    icon: any;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all rounded-lg
        ${
          currentView === value
            ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        }
      `}
    >
      <Icon
        size={18}
        className={currentView === value ? "text-blue-600" : "text-gray-400"}
      />
      {label}
    </button>
  );

  const SectionHeader = ({
    label,
    icon: Icon,
    isOpen,
    onToggle,
  }: {
    label: string;
    icon: any;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-2 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} />
        {label}
      </div>
      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 space-y-8">
      <div className="flex flex-col gap-6">
        {/* Navigation Sections */}
        <div className="space-y-4">
          {/* Posts Section */}
          <div className="space-y-1">
            <SectionHeader
              label="Bài viết"
              icon={FileText}
              isOpen={isPostsOpen}
              onToggle={() => setIsPostsOpen(!isPostsOpen)}
            />
            <AnimatePresence initial={false}>
              {isPostsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-1"
                >
                  <NavItem
                    value="explore"
                    label="Khám phá"
                    icon={Compass}
                    onClick={() => changeView("explore")}
                  />
                  <NavItem
                    value="my_posts"
                    label="Bài viết của tôi"
                    icon={UserCircle}
                    onClick={() => changeView("my_posts")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Following Section */}
          <div className="space-y-1">
            <SectionHeader
              label="Theo dõi"
              icon={Users}
              isOpen={isFollowingOpen}
              onToggle={() => setIsFollowingOpen(!isFollowingOpen)}
            />
            <AnimatePresence initial={false}>
              {isFollowingOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-1"
                >
                  <NavItem
                    value="followers"
                    label="Người theo dõi"
                    icon={UserPlus}
                    onClick={() => {
                      setFollowModalType("followers");
                      setOpenFollowModal(true);
                    }}
                  />
                  <NavItem
                    value="following"
                    label="Đang theo dõi"
                    icon={UserCheck}
                    onClick={() => {
                      setFollowModalType("following");
                      setOpenFollowModal(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Search Toggle */}
          <Button
            onClick={() => setShowSearch(!showSearch)}
            className={`
                flex items-center gap-2 justify-start
                border-blue-600 transition-colors
                ${
                  showSearch
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
          >
            <Search size={16} />
            Tìm kiếm
          </Button>

          {/* Inline Search Input */}
          {showSearch && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                {keyword && (
                  <button
                    onClick={() => {
                      setKeyword("");
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.delete("search");
                      router.push(`/community?${params.toString()}`);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}
