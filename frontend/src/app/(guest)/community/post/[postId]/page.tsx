"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchPostDetail } from "@/store/slice/community/postSlice";
import type { AppDispatch, RootState } from "@/store";
import PostDetailView from "@/components/community/post/PostDetailView";
import { Suspense } from "react";

function PostDetailPageContent() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const postId = params?.postId ? parseInt(params.postId as string) : null;

  const { currentPost, loading, error } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostDetail(postId));
    }
  }, [dispatch, postId]);

  if (loading && !currentPost) {
    return (
      <div className="bg-slate-900 rounded-3xl p-20 text-center border border-slate-800 shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-6 shadow-indigo-500/20" />
        <p className="text-slate-400 text-lg font-black uppercase tracking-widest">
          Đang tải bài viết...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-3xl p-16 text-center border border-red-500/20 shadow-2xl">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <span className="text-4xl">⚠️</span>
        </div>
        <p className="text-red-400 font-black text-xl mb-2">Đã xảy ra lỗi</p>
        <p className="text-slate-500 font-medium mb-8">{error}</p>
        <button
          onClick={() => postId && dispatch(fetchPostDetail(postId))}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!currentPost && !loading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-16 text-center border border-slate-800 shadow-2xl">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <span className="text-4xl text-indigo-500/50">🔍</span>
        </div>
        <p className="text-slate-200 font-black text-xl mb-2">Không tìm thấy bài viết</p>
        <p className="text-slate-500 font-medium mb-8">Bài viết có thể đã bị xóa hoặc không còn tồn tại.</p>
        <a
          href="/community"
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 inline-block"
        >
          Quay lại bảng tin
        </a>
      </div>
    );
  }

  return <PostDetailView post={currentPost} />;
}

export default function PostDetailPage() {
  return (
    <Suspense fallback={<div className="h-60 bg-slate-900/50 rounded-3xl animate-pulse shadow-2xl border border-slate-800/50" />}>
      <PostDetailPageContent />
    </Suspense>
  );
}
