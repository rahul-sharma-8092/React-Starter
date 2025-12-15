
import { useId, useMemo } from 'react';
import Select, {
  components,
  type Props as SelectProps,
  type MultiValue,
  type ActionMeta,
} from 'react-select';
import { ChevronDown, X, Square, CheckSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MultiSelectOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

export interface ColumnConfig {
    key: string;
    header?: string;
    width?: string; // e.g., '30%', '100px'
}

interface MultiSelectProps extends Omit<SelectProps<MultiSelectOption, true>, 'onChange' | 'value' | 'className'> {
  label?: string;
  error?: string;
  className?: string; // Container class
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  selectAllLabel?: string;
  columns?: ColumnConfig[];
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors" />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: any) => {
  return (
    <components.ClearIndicator {...props}>
      <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
    </components.ClearIndicator>
  );
};

// Custom Option with Checkbox and Columns
const Option = (props: any) => {
  const { columns } = props.selectProps;

  return (
    <components.Option {...props}>
      <div className="flex items-center w-full gap-2 relative">
        {props.isSelected ? (
           <CheckSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
        ) : (
           <Square className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
        
        {columns && columns.length > 0 ? (
             <div className="flex w-full items-center gap-2">
                 {columns.map((col: ColumnConfig, index: number) => (
                    <div 
                        key={col.key} 
                        style={{ width: col.width, flex: col.width ? 'none' : 1 }}
                        className={cn("truncate", index === 0 ? "font-medium" : "text-gray-500 text-xs")}
                    >
                         {/* Handle Select All special case label if data is missing the key (unlikely for "Select All" as we construct it) */}
                         {props.data.value === '__select_all__' && index === 0 ? props.label : props.data[col.key]}
                    </div>
                 ))}
            </div>
        ) : (
            <span className="truncate">{props.label}</span>
        )}
      </div>
    </components.Option>
  );
};

// Custom ValueContainer to control display logic
const ValueContainer = ({ children, ...props }: any) => {
    const { getValue, options, selectProps } = props;
    const selected = getValue();
    const totalOptions = options.length;
    const selectedCount = selected.length;
    
    // Logic to show "Select All" option count if that option is present in "options" but filtered out here usually
    // We'll rely on checking if *every* selectable option is selected
    // Note: 'options' passed to ValueContainer might include the "Select All" dummy if not careful, 
    // but usually react-select filters it. We will manage "Select All" logic carefully.

    let displayChildren = children;

    // Check if we have children to display (placeholder is handled by react-select usually)
    // If has value, react-select renders [ MultiValue(s), Input ]
    
    if (selectedCount > 0) {
        let labelText = "";
        
        // Check if all actually selected (ignoring the "Select All" dummy if it made it in)
        const isAllSelected = selectedCount > 0 && selectedCount === (selectProps.optionCountWithOutSelectAll ?? totalOptions);
        
        if (isAllSelected) {
            labelText = "All items selected";
        } else if (selectedCount === 1) {
            labelText = selected[0].label;
        } else {
            labelText = `${selectedCount} items selected`;
        }

        displayChildren = (
            <div className="flex items-center text-gray-900 absolute left-2 right-8 truncate pointer-events-none">
                {labelText}
            </div>
        );
         // Keep the Input for searching functionality, but hide the MultiValues
         const inputChild = children[1]; // children is usually [ [MultiValue...], Input ]
         displayChildren = [ displayChildren, inputChild ];
    }

    return (
      <components.ValueContainer {...props}>
        {displayChildren}
      </components.ValueContainer>
    );
};


// Custom Menu to add Footer
const Menu = (props: any) => {
  const optionCount = props.options.filter((o: any) => o.value !== '__select_all__').length;
  return (
    <components.Menu {...props}>
      {props.children}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 font-medium text-center">
           Total: {optionCount} options
      </div>
    </components.Menu>
  );
};

const MultiSelect = ({
  options,
  value,
  onChange,
  label,
  error,
  isDisabled,
  isLoading,
  isClearable = true,
  isSearchable = true,
  placeholder = 'Select...',
  className,
  selectAllLabel = "Select All",
  columns,
  ...props
}: MultiSelectProps) => {
  const id = useId();

  // "Select All" object
  const selectAllOption = useMemo(() => ({ label: selectAllLabel, value: "__select_all__" }), [selectAllLabel]);

  // Derived state: Is "Select All" checked?
  const isAllSelected = options.length > 0 && value.length === options.length;

  // Options with "Select All" prepended
  const combinedOptions = useMemo(() => {
      // Don't show Select All if empty or searching (react-select usually handles searching, but prepending is easy)
      if (options.length === 0) return [];
      return [selectAllOption, ...options];
  }, [options, selectAllOption]);

  // Map primitive values back to objects
  const selectedValues = useMemo(() => {
      return options.filter(opt => value.includes(opt.value));
  }, [value, options]);


  // Custom handler to override the Select's onChange to handle the toggling logic more robustly
  // We need to intercept specifically because `isOptionSelected` logic might be needed if we want custom checkbox behavior
  
  // Actually, simplest way for "Toggle Select All":
  // We need `hideSelectedOptions={false}` so we can see the options to uncheck them.
  // We also want to manually control `value`.

  const handleCustomChange = (newValue: MultiValue<MultiSelectOption>, actionMeta: ActionMeta<MultiSelectOption>) => {
      const { option } = actionMeta;

      if (option?.value === selectAllOption.value) {
          if (isAllSelected) {
              onChange([]); // Toggle OFF
          } else {
              onChange(options.map(o => o.value)); // Toggle ON
          }
          return;
      }
      
      // Standard Mapping
      const candidates = newValue as MultiSelectOption[];
      // Filter out Select All if it somehow got in
      const validCandidates = candidates.filter(c => c.value !== selectAllOption.value);
      onChange(validCandidates.map(c => c.value));
  };


  // styling
  const controlStyles = {
    base: 'flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out shadow-sm min-h-[38px]', // min-h to match
    focus: 'ring-2 ring-blue-500 border-blue-500',
    error: 'border-red-500 ring-red-500 focus:ring-red-500',
  };

  const menuStyles = 'mt-2 rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden';
  const optionStyles = {
    base: 'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-150',
    hover: 'bg-gray-100 text-gray-900',
    selected: 'bg-blue-50 text-blue-900 font-medium', // We might override this since we want custom checkbox look
    active: 'bg-gray-100', // react-select "focused" option
  };


  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900"
        >
          {label}
        </label>
      )}
      <Select
        inputId={id}
        isMulti
        options={combinedOptions}
        value={selectedValues} // We pass objects to React-Select
        onChange={handleCustomChange}
        hideSelectedOptions={false} // Crucial for Checkbox UX
        closeMenuOnSelect={false} // Keep open for multi-selection
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        placeholder={placeholder}
        unstyled
        // Pass extra prop for ValueContainer to know true total
        // @ts-ignore
        optionCountWithOutSelectAll={options.length}
        // @ts-ignore - passing custom props to Select for components to access
        columns={columns}
        
        components={{
          DropdownIndicator,
          ClearIndicator,
          Option,
          ValueContainer,
          Menu,
          MultiValue: () => null,
        }}
        classNames={{
          control: ({ isFocused }) =>
            cn(
              controlStyles.base,
              isFocused ? controlStyles.focus : '',
              error ? controlStyles.error : ''
            ),
          placeholder: () => 'text-gray-500',
          input: () => 'text-gray-900',
          menu: () => menuStyles,
          menuList: () => 'overflow-y-auto overflow-x-hidden max-h-[300px] p-1',
          option: ({ isFocused, isSelected }) => {
              // Special style for Select All to separate it optionally?
              // For now standard style
              return cn(
                optionStyles.base,
                isFocused ? optionStyles.hover : '',
                isSelected ? 'bg-blue-50/50' : '', // lighter background for selected since we have checkbox
                'mx-1 my-0.5 rounded-md'
              );
          },
          noOptionsMessage: () => 'text-gray-500 p-2 text-sm',
        }}
        // Custom logic to show "Select All" as selected if all are selected
        isOptionSelected={(option, selectValue) => {
            if (option.value === selectAllOption.value) return isAllSelected;
            return selectValue.some(i => i.value === option.value);
        }}
        {...props}
      />
      {error && (
        <p className="text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
