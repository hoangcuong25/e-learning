"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { AnimatePresence, motion } from "framer-motion";

export function MobileCommunitySidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Menu size={16} />
          Menu cộng đồng
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white p-4 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <CommunitySidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
