import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc, GraduationCap } from "lucide-react";
import { useDebounce } from "use-debounce";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllSpecializations } from "@/store/slice/common/specializationSlice";

interface Props {
  onSearch: (search: string) => void;
  onSort: (sortBy: string, order: "asc" | "desc") => void;
  onFilterBySpecialization: (specName: string | null) => void;
}

const CoursesFilter = ({
  onSearch,
  onSort,
  onFilterBySpecialization,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { specializations } = useSelector(
    (state: RootState) => state.specialization
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  const handleSortChange = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onSort("price", newOrder);
  };

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    onFilterBySpecialization(selectedSpec);
  }, [selectedSpec]);

  useEffect(() => {
    dispatch(fetchAllSpecializations());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      {/* Search Bar */}
      <div className="relative flex-1 group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Tìm khóa học bạn quan tâm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Specialization Select */}
        <div className="relative min-w-[220px]">
          <Select
            onValueChange={(value) => {
              if (value === "all") setSelectedSpec(null);
              else setSelectedSpec(value);
            }}
          >
            <SelectTrigger className="w-full h-[58px] bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-2 focus:ring-indigo-500/20 hover:bg-slate-100 transition-all font-bold text-slate-900">
               <div className="flex items-center gap-3">
                  <GraduationCap size={18} className="text-indigo-600" />
                  <SelectValue placeholder="Chuyên ngành" />
               </div>
            </SelectTrigger>

            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
              <SelectItem
                value="all"
                className="cursor-pointer rounded-xl font-bold py-3 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                Tất cả chuyên ngành
              </SelectItem>

              {specializations.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.name}
                  className="cursor-pointer rounded-xl font-bold py-3 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSortChange}
          className="h-[58px] px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest text-slate-900 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm shadow-slate-100"
        >
          {order === "asc" ? (
            <>
              <SortAsc size={18} className="text-indigo-600" />
              <span>Giá: Thấp → Cao</span>
            </>
          ) : (
            <>
              <SortDesc size={18} className="text-indigo-600" />
              <span>Giá: Cao → Thấp</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};


export default CoursesFilter;
