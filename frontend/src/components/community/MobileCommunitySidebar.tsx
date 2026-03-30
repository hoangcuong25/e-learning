"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { AnimatePresence, motion } from "framer-motion";

export function MobileCommunitySidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <div className="lg:hidden flex justify-between items-center mb-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200"
        >
          <Menu size={16} />
          Menu cộng đồng
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sidebar drawer */}
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-slate-950 border-r border-slate-800 p-4 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <CommunitySidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
