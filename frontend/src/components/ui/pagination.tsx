import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ total, page, onChange }: PaginationProps) => {
  return (
    <div className="flex gap-4 items-center justify-center mt-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />
        <span>Trước</span>
      </motion.button>

      <div className="flex items-center justify-center min-w-[120px]">
        <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Trang</span>
        <span className="ml-2 text-xl font-black text-slate-900 tracking-tighter">{page}</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-sm font-black text-slate-400">{total}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-30 disabled:pointer-events-none"
      >
        <span>Tiếp</span>
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
};

