import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ total, page, onChange }: PaginationProps) => {
  return (
    <div className="flex gap-2 items-center justify-center mt-4">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Trước
      </Button>
      <span className="px-2 text-gray-600">Trang {page}</span>
      <Button
        variant="outline"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        Tiếp
      </Button>
    </div>
  );
};
