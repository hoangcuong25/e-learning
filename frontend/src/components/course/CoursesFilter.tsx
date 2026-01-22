import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc } from "lucide-react";

interface Props {
  onSearch: (search: string) => void;
  onSort: (sortBy: string, order: "asc" | "desc") => void;
}

const CoursesFilter = ({ onSearch, onSort }: Props) => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onSort("price", newOrder);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Tìm khóa học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="secondary"
          onClick={() => onSearch(search)}
          className="flex items-center gap-1"
        >
          <Search className="w-4 h-4" /> Tìm kiếm
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={handleSortChange}
        className="flex items-center gap-1"
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
