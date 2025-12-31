import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc, GraduationCap } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllSpecializations } from "@/store/slice/specializationSlice";

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
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      {/* Tìm kiếm */}
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm khóa học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Chọn chuyên ngành */}
        <div className="flex items-center gap-2">
          <GraduationCap className="text-gray-400 w-4 h-4" />
          <Select
            onValueChange={(value) => {
              if (value === "all") setSelectedSpec(null);
              else setSelectedSpec(value);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chuyên ngành" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                value="all"
                className="cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 rounded-md"
              >
                Tất cả
              </SelectItem>

              {specializations.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.name}
                  className="cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 rounded-md"
                >
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sắp xếp theo giá */}
      <Button
        variant="outline"
        onClick={handleSortChange}
        className="flex items-center gap-1 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
      >
        {order === "asc" ? (
          <>
            <SortAsc className="w-4 h-4" /> Giá tăng dần
          </>
        ) : (
          <>
            <SortDesc className="w-4 h-4" /> Giá giảm dần
          </>
        )}
      </Button>
    </div>
  );
};

export default CoursesFilter;
