import { useState, useEffect } from "react";
import { DatePicker } from "./DatePicker";
import SingleSelect, { type SingleSelectOption } from "./ui/SingleSelect";
import MultiSelect, { type MultiSelectOption } from "./ui/MultiSelect";
import { X } from "lucide-react";

export interface FilterState {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  status: SingleSelectOption | null;
  categories: MultiSelectOption[];
}

interface TodoFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: SingleSelectOption[] = [
  { label: "Urgent", value: "urgent" },
  { label: "High", value: "high" },
  { label: "Normal", value: "normal" },
  { label: "Low", value: "low" },
];

const CATEGORY_OPTIONS: MultiSelectOption[] = [
  { label: "Work", value: "work" },
  { label: "Personal", value: "personal" },
  { label: "Shopping", value: "shopping" },
  { label: "Health", value: "health" },
];

export function TodoFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onClear,
}: TodoFilterModalProps) {
  // Local state for the modal
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync local state when modal opens or parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedState: FilterState = {
      fromDate: undefined,
      toDate: undefined,
      status: null,
      categories: [],
    };
    setLocalFilters(clearedState);
    onClear(); 
  };

  const handleClearAndClose = () => {
    handleClear();
    // Also apply the cleared state?
    const clearedState: FilterState = {
        fromDate: undefined,
        toDate: undefined,
        status: null,
        categories: [],
    };
    onApply(clearedState);
    onClose();
  }

  return (
    <div className="absolute top-full mt-2 right-0 z-20 w-80 rounded-xl border border-gray-200 bg-white shadow-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              value={localFilters.fromDate}
              onChange={(date) =>
                setLocalFilters((prev) => ({ ...prev, fromDate: date }))
              }
              placeholder="From"
            />
            <DatePicker
              value={localFilters.toDate}
              onChange={(date) =>
                setLocalFilters((prev) => ({ ...prev, toDate: date }))
              }
              placeholder="To"
              popoverAlign="right"
            />
          </div>
        </div>

        {/* Single Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status (Single)
          </label>
          <SingleSelect
            options={STATUS_OPTIONS}
            value={localFilters.status}
            onChange={(val) =>
              setLocalFilters((prev) => ({ ...prev, status: val }))
            }
            placeholder="Select Status"
          />
        </div>

        {/* Multi Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categories (Multi)
          </label>
          <MultiSelect
            options={CATEGORY_OPTIONS}
            value={localFilters.categories.map((c) => c.value)}
            onChange={(vals) => {
              // MultiSelect returns array of values (strings/numbers), we need to map back to objects
              const selectedOptions = CATEGORY_OPTIONS.filter((opt) =>
                vals.includes(opt.value)
              );
              setLocalFilters((prev) => ({
                ...prev,
                categories: selectedOptions,
              }));
            }}
            placeholder="Select Categories"
            selectAllLabel="All Categories"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={handleClearAndClose}
          className="flex-1 py-2 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
