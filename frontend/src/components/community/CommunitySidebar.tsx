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
import CreatePostDialog from "./post/CreatePostDialog";

export default function CommunitySidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "explore";
  const queryFromUrl = searchParams.get("search") || "";

  const [openCreatePost, setOpenCreatePost] = useState(false);
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

    if (currentView === "my_posts" && user) {
      params.authorId = user.id;
    }

    dispatch(fetchAllPosts(params));

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
        flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-xl
        ${
          currentView === value
            ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
        }
      `}
    >
      <Icon
        size={16}
        className={currentView === value ? "text-indigo-400" : "text-slate-500"}
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
      className="flex items-center justify-between w-full px-2 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-slate-300 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={12} />
        {label}
      </div>
      {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </button>
  );

  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-6">
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
                  onClick={() => changeView("followers")}
                />
                <NavItem
                  value="following"
                  label="Đang theo dõi"
                  icon={UserCheck}
                  onClick={() => changeView("following")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {/* Search Toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 ${
            showSearch
              ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
          }`}
        >
          <Search size={14} />
          Tìm kiếm
        </button>

        {/* Inline Search Input */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative mt-1">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-4 pr-8 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Post Button */}
        <button
          onClick={() => setOpenCreatePost(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={14} />
          Tạo bài viết
        </button>
      </div>

      {/* Create Post Dialog */}
      {user && (
        <CreatePostDialog
          open={openCreatePost}
          onOpenChange={setOpenCreatePost}
          userAvatar={user.avatar}
          userName={user.fullname}
        />
      )}
    </div>
  );
}
