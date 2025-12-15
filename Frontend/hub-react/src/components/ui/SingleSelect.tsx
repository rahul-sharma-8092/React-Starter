
import { useId } from 'react';
import Select, {
  components,
  type Props as SelectProps,
} from 'react-select';
import { ChevronDown, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SingleSelectOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

export interface ColumnConfig {
    key: string;
    header?: string;
    width?: string; // e.g., '30%', '100px'
}

interface SingleSelectProps extends Omit<SelectProps<SingleSelectOption, false>, 'className'> {
  label?: string;
  error?: string;
  className?: string; // Container class
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

// Custom Option to show columns or standard label
const Option = (props: any) => {
  const { columns } = props.selectProps;

  return (
    <components.Option {...props}>
      <div className="flex items-center w-full relative">
        {columns && columns.length > 0 ? (
            <div className="flex w-full items-center gap-2 pr-6">
                 {columns.map((col: ColumnConfig, index: number) => (
                    <div 
                        key={col.key} 
                        style={{ width: col.width, flex: col.width ? 'none' : 1 }}
                        className={cn("truncate", index === 0 ? "font-medium" : "text-gray-500 text-xs")}
                    >
                        {props.data[col.key]}
                    </div>
                 ))}
            </div>
        ) : (
             <span className="pr-6">{props.label}</span>
        )}
        
        {props.isSelected && <Check className="h-4 w-4 text-blue-600 absolute right-2 top-1/2 -translate-y-1/2" />}
      </div>
    </components.Option>
  );
};



const SingleSelect = ({
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
  columns,
  ...props
}: SingleSelectProps) => {
  const id = useId();

  // Tailwind class configurations
  const controlStyles = {
    base: 'flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3  text-sm ring-offset-white placeholder:text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out shadow-sm',
    focus: 'ring-2 ring-blue-500 border-blue-500',
    error: 'border-red-500 ring-red-500 focus:ring-red-500',
  };

  const menuStyles = 'mt-2 rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden';
  const optionStyles = {
    base: 'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-150',
    hover: 'bg-gray-100 text-gray-900',
    selected: 'bg-blue-50 text-blue-900 font-medium',
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
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable} // react-select default is true, but explicit is good
        placeholder={placeholder}
        unstyled // Important for full Tailwind control
        // @ts-ignore - passing custom props to Select for components to access
        columns={columns} 
        components={{
          DropdownIndicator,
          ClearIndicator,
          Option,
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
          singleValue: () => 'text-gray-900 w-full', // Ensure SingleValue takes full width for grid
          menu: () => menuStyles,
          menuList: () => 'overflow-y-auto overflow-x-hidden max-h-[300px] p-1', // prevent horizontal scroll
          option: ({ isFocused, isSelected }) =>
            cn(
              optionStyles.base,
              isFocused ? optionStyles.hover : '',
              isSelected ? optionStyles.selected : '',
              'mx-1 my-0.5 rounded-md' // small margin for hovering effect look
            ),
          noOptionsMessage: () => 'text-gray-500 p-2 text-sm',
          multiValue: () => 'bg-gray-100 rounded-md items-center py-0.5 pl-2 pr-1 gap-1.5', // just in case
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

export default SingleSelect;
