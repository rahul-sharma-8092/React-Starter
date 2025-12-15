import { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { Eye, Search, Filter } from "lucide-react";
import { format, isWithinInterval, subDays } from "date-fns";
import { TodoFilterModal, type FilterState } from "../components/TodoFilterModal";
import SingleSelect, { type SingleSelectOption } from "../components/ui/SingleSelect";

const VIEW_OPTIONS: SingleSelectOption[] = [
    { label: "Default View", value: "default" },
    { label: "Compact View", value: "compact" },
];

// Setup Types
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  // Augmented fields
  createdAt: Date;
  status: "urgent" | "high" | "normal" | "low";
  category: "work" | "personal" | "shopping" | "health";
}

type TabValue = "all" | "completed" | "pending";
type ViewType = "default" | "compact";

ModuleRegistry.registerModules([ AllCommunityModule ]);

export default function TodoGridPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<ViewType>("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    fromDate: undefined,
    toDate: undefined,
    status: null,
    categories: [],
  });

  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Data Fetching
  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get<Omit<Todo, "createdAt" | "status" | "category">[]>(
        "https://jsonplaceholder.typicode.com/todos"
      );
      // Augment data with Mock Date and extra fields for filters
      return res.data.map((todo) => ({
        ...todo,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 30)), // Random date last 30 days
        status: ["urgent", "high", "normal", "low"][Math.floor(Math.random() * 4)] as Todo["status"],
        category: ["work", "personal", "shopping", "health"][Math.floor(Math.random() * 4)] as Todo["category"],
      }));
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Filtering Logic
  const rowData = useMemo(() => {
    if (!todos) return [];

    return todos.filter((todo) => {
      // Tab Filter
      if (activeTab === "completed" && !todo.completed) return false;
      if (activeTab === "pending" && todo.completed) return false;

      // Advanced Filters
      if (filters.fromDate || filters.toDate) {
        const start = filters.fromDate || new Date(0); // Epoch if undefined
        const end = filters.toDate || new Date(2100, 0, 1); // Future if undefined
        // Ensure end date includes the full day
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        
        if (!isWithinInterval(todo.createdAt, { start, end: endOfDay })) {
            return false;
        }
      }

      if (filters.status && todo.status !== filters.status.value) {
        return false;
      }

      if (
        filters.categories.length > 0 &&
        !filters.categories.some((cat) => cat.value === todo.category)
      ) {
        return false;
      }

      return true;
    });
  }, [todos, activeTab, filters]);

  // Column Definitions
  const columnDefs = useMemo<ColDef<Todo>[]>(() => {
    const baseCols: ColDef<Todo>[] = [
      { field: "id", headerName: "ID", width: 70, sortable: true, filter: true },
      { 
        field: "title", 
        headerName: "Title", 
        flex: 2, 
        sortable: true, 
        filter: true,
        tooltipField: "title" // Default Browser Tooltip
      },
      {
        field: "completed",
        headerName: "Status",
        width: 120,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<Todo>) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              params.value
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {params.value ? "Completed" : "Pending"}
          </span>
        ),
      },
    ];

    if (view === "default") {
        baseCols.push({
            field: "createdAt",
            headerName: "Created Date",
            width: 150,
            valueFormatter: (params: ValueFormatterParams<Todo, Date>) => {
                return params.value ? format(params.value, 'dd/MM/yyyy') : '-';
            },
            sortable: true
        });
        baseCols.push({
            field: "category",
            headerName: "Category",
            width: 120,
            cellRenderer: (params: ICellRendererParams<Todo>) => <span className="capitalize">{params.value}</span>
        });
         baseCols.push({
            field: "status",
            headerName: "Priority",
            width: 120,
             cellRenderer: (params: ICellRendererParams<Todo>) => <span className="capitalize">{params.value}</span>
        });
    }

    // Actions Column with Custom Tooltip
    baseCols.push({
      headerName: "Actions",
      width: 100,
      cellRenderer: (params: ICellRendererParams<Todo>) => (
        <div className="flex items-center justify-center h-full group relative">
          <button className="p-1 hover:bg-gray-100 rounded-full text-blue-600">
            <Eye className="h-4 w-4" />
          </button>
          {/* Custom Tooltip on Hover */}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 z-50">
             <p className="font-semibold">Details:</p>
             <p>User ID: {params.data?.userId}</p>
             <p>Title: {params.data?.title.slice(0, 20)}...</p>
             <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      ),
    });

    return baseCols;
  }, [view]);


  return (
    <div className="h-[calc(100vh-80px)] p-6 bg-gray-50 flex flex-col gap-4">
      {/* Header / Nav */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg space-x-2">
                {(["all", "completed", "pending"] as TabValue[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === tab
                             ? "bg-white text-blue-600 shadow-sm"
                             : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative group flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search todos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                </div>

                {/* View Dropdown */}
                {/* View Dropdown */}
                 <div className="w-40">
                    <SingleSelect
                        value={VIEW_OPTIONS.find(opt => opt.value === view)}
                        onChange={(option) => setView(option?.value as ViewType)}
                        options={VIEW_OPTIONS}
                        isClearable={false}
                        isSearchable={false}
                    />
                 </div>

                {/* Filter Button */}
                <div className="relative">
                    <button
                        ref={filterButtonRef}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`p-2 rounded-lg border transition-colors ${
                            isFilterOpen || filters.fromDate || filters.toDate || filters.status || filters.categories.length > 0
                             ? "bg-blue-50 border-blue-200 text-blue-600"
                             : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Filter className="h-5 w-5" />
                    </button>

                     {/* Filter Modal - Just below the button */}
                     {isFilterOpen && (
                         <div className="absolute right-0 top-full mt-2 z-50">
                             <TodoFilterModal
                                isOpen={isFilterOpen}
                                onClose={() => setIsFilterOpen(false)}
                                filters={filters}
                                onApply={setFilters}
                                onClear={() => setFilters({
                                    fromDate: undefined,
                                    toDate: undefined,
                                    status: null,
                                    categories: [],
                                })}
                             />
                         </div>
                     )}
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white ag-theme-alpine">
        {isLoading ? (
             <div className="h-full flex items-center justify-center text-gray-500">
                 Loading Todos...
             </div>
        ) : (
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={20}
                paginationPageSizeSelector={[10, 20, 50, 100, 200]}
                animateRows={true}
                enableCellTextSelection={true}
                tooltipShowDelay={0}
                quickFilterText={searchQuery}
            />
        )}
      </div>
    </div>
  );
}
