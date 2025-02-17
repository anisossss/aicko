import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

interface CategoryGridProps {
  categories: string[];
  itemsPerPage?: number;
  setFilters: (filters: any) => void;
}

const CategoryGrid = ({
  categories,
  itemsPerPage = 1200,
  setFilters
}: CategoryGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  return (
    <ScrollArea className="overflow-y-auto h-[calc(100vh-150px)] w-[200px] ">
      <div
        className="flex gap-4 p-2"
        style={{ flexDirection: "column", gap: "1rem" }}
      >
        <div
            onClick={() =>
              setFilters((prev: any) => ({ ...prev, category: "",page:1 }))
            }
            key={`all`}
            className="cursor-pointer flex justify-center items-center relative overflow-hidden rounded-lg border bg-card p-4 text-card-foreground transition-all hover:scale-[1.02] hover:shadow-sm"
          >
            <h3 className="text-center text-xs font-medium sm:text-base">
              Tous
            </h3>
          </div>
        {paginatedCategories.map((category, index) => (
          <div
            onClick={() =>
              setFilters((prev: any) => ({ ...prev, category: category,page:1 }))
            }
            key={`${category}-${index}`}
            className="cursor-pointer flex justify-center items-center relative overflow-hidden rounded-lg border bg-card p-4 text-card-foreground transition-all hover:scale-[1.02] hover:shadow-sm"
          >
            <h3 className="text-center text-xs font-medium sm:text-base">
              {category}
            </h3>
          </div>
        ))}
      </div>

      {/* <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent hover:bg-accent"
        >
          Previous
        </button>
        
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent hover:bg-accent"
        >
          Next
        </button>
      </div> */}
    </ScrollArea>
  );
};

export default CategoryGrid;
