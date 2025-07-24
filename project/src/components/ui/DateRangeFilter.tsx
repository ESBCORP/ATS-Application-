import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from './Button';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangeFilterProps {
  onFilterChange: (range: DateRange) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [customRange, setCustomRange] = useState<DateRange>({ start: null, end: null });

  const handlePresetClick = (preset: string) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      default:
        start = null;
        end = null;
    }

    const range = { start, end };
    setSelectedRange(range);
    onFilterChange(range);
    setIsOpen(false);
  };

  const handleCustomRangeChange = (field: 'start' | 'end', value: string) => {
    setCustomRange(prev => ({
      ...prev,
      [field]: value ? new Date(value) : null
    }));
  };

  const applyCustomRange = () => {
    setSelectedRange(customRange);
    onFilterChange(customRange);
    setIsOpen(false);
  };

  const clearFilter = () => {
    const emptyRange = { start: null, end: null };
    setSelectedRange(emptyRange);
    setCustomRange(emptyRange);
    onFilterChange(emptyRange);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedRange.start && selectedRange.end) {
      return `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`;
    }
    return 'Filter by Date';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {getDisplayText()}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="space-y-2">
            <button
              onClick={() => handlePresetClick('week')}
              className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              This Week
            </button>
            <button
              onClick={() => handlePresetClick('month')}
              className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              This Month
            </button>
            <button
              onClick={() => handlePresetClick('quarter')}
              className="block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              This Quarter
            </button>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Custom Range</p>
            <div className="space-y-2">
              <input
                type="date"
                value={customRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleCustomRangeChange('start', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="date"
                value={customRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleCustomRangeChange('end', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={clearFilter}>
              Clear
            </Button>
            <Button size="sm" onClick={applyCustomRange}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;