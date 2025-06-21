import { VariantProps, cva } from 'class-variance-authority';
import {
  CheckIcon,
  ChevronDown,
  PlusIcon,
  Trash2,
  XCircle,
  XIcon,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';

import { cn } from '@/lib/utils';
import { TBtnVariant, TLabelValue } from '@/types/global';
import Loading from '../ui/loading';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150   duration-300',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Props for MultiSelect component
 */

export interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;

    /**Optional icon component to display alongside the option. */
    id?: string;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  // onValueChange: (value: string[]) => void;
  onValueChange: (value: TLabelValue[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];
  Values?: TLabelValue[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * Maximum number of items can be selected.
   * Optional
   */
  maxSelection?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
  isLoading?: boolean;
  /**
   * Additional props to pass to the multi-select component.
   * Optional, can be used to add custom props.
   */
  addButton?:
    | {
        label?: string;
        variant?: TBtnVariant;
        className?: string;
        handleClick?: () => void;
        icon?: string;
      }
    | false;

  /**
   * Additional props to pass to the multi-select component.
   * Optional, can be used to add custom props.
   */
  deleteAction?: (id: string) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  node?: {
    position: 'right';
    node: React.ComponentType<{ id: string }>;
  };
}

export const SelectMultiple = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = Number.MAX_SAFE_INTEGER,
      modalPopover = false,
      className,
      isLoading,
      Values,
      maxSelection,
      addButton,
      deleteAction,
      node,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<TLabelValue[]>(
      [],
    );

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    React.useEffect(() => {
      if (
        Values !== undefined &&
        Values.length > 0 &&
        typeof Values[0] === 'object'
      ) {
        // Check if Values is an array of objects with label and value properties
        if (Values.every((item) => 'label' in item && 'value' in item)) {
          //Check if values exist in options
          const matchedOptions = options.filter((option) =>
            Values.some((value) => value.value === option.value),
          );

          setSelectedValues(matchedOptions || []);
        }
      } else if (Array.isArray(defaultValue)) {
        const matchedOptions = options.filter((option) =>
          defaultValue.includes(option.value),
        );
        setSelectedValues(matchedOptions || []);
      }
    }, [Values, JSON.stringify(defaultValue), JSON.stringify(options)]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];

        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (single: TLabelValue): void => {
      const newSelectedValues = selectedValues.some(
        (v) => v.value === single.value,
      )
        ? selectedValues.filter((v) => v.value !== single.value)
        : [...selectedValues, single];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = (): void => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = (): void => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = (): void => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === 'Tab') {
        setIsPopoverOpen(true);
      } else if (e.key === 'Escape') {
        setIsPopoverOpen(false);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'dark:bg-background flex h-auto min-h-10 w-full max-w-[300px] items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 p-1 hover:bg-emerald-50/30 active:scale-100',
              className,
            )}
            onKeyUp={handleKeyDown}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((single, idx) => {
                    const option = options.find(
                      (o) => o.value === single.value,
                    );
                    const IconComponent = option?.icon;

                    return (
                      <>
                        <Badge
                          key={single.value + idx}
                          className={cn(
                            'z-50 font-normal whitespace-normal',
                            multiSelectVariants({ variant }),
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {IconComponent && (
                            <IconComponent className="mr-2 h-4 w-4" />
                          )}
                          {option?.label}
                          <button
                            type="button"
                            tabIndex={-1}
                            className="z-50 ml-2 h-4 w-4 cursor-pointer border-none bg-transparent p-0"
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              toggleOption(single);
                            }}
                          >
                            <XCircle />
                          </button>
                        </Badge>
                      </>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        'text-foreground border-foreground/1 bg-transparent hover:bg-transparent',
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <button
                        type="button"
                        tabIndex={-1}
                        className="z-50 ml-2 h-4 w-4 cursor-pointer border-none bg-transparent p-0"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          clearExtraOptions();
                        }}
                      >
                        <XCircle />
                      </button>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-foreground z-50 mx-2 h-4 w-4 cursor-pointer border-none bg-transparent p-0"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleClear();
                    }}
                  >
                    <XIcon />
                  </button>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground h-4 cursor-pointer',
                      selectedValues.length > 0 && 'hidden',
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-foreground mx-2 w-[75%] truncate text-left text-sm font-normal opacity-50">
                  {placeholder}
                </span>
                <ChevronDown className="text-muted-foreground mx-2 h-4 w-4 cursor-pointer" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="popover-content-width-full border-input shadow-select scrollbar-thin-custom -mt-2 overflow-hidden rounded-[0.5rem] border p-2"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          side={props.side}
        >
          <Command
            filter={(value, search) => {
              if (value.includes(search.toLowerCase())) {
                return 1;
              }

              return 0;
            }}
            className="z-10 max-h-[300px] overflow-y-auto"
          >
            <CommandInput
              placeholder="Search here"
              onKeyDown={handleInputKeyDown}
            />

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="!mx-0 px-0">
                {/* <CommandItem
                  key='all'
                  onSelect={toggleAll}
                  className='font-medium cursor-pointer'
                >
                  <span>
                    {options.length === selectedValues.length
                      ? "Unselect"
                      : "Select"}
                    All
                  </span>
                </CommandItem> */}
                {isLoading ? (
                  <Loading />
                ) : (
                  <ScrollArea>
                    {options.map((option, index) => {
                      const isSelected = selectedValues.some(
                        (selected) => selected.value === option.value,
                      );
                      //  this is for css injection
                      const escapedValue = CSS.escape(option?.label);

                      return (
                        <CommandItem
                          key={option.value}
                          value={escapedValue + index}
                          onSelect={() => toggleOption(option)}
                          className="group cursor-pointer content-stretch p-3"
                          disabled={
                            maxSelection
                              ? selectedValues.length >= maxSelection
                              : false
                          }
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex flex-1 items-center">
                              <div
                                className={cn(
                                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-600',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50 [&_svg]:invisible',
                                )}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </div>
                              {option.icon && (
                                <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                              )}
                              <span>{option.label}</span>
                            </div>
                            {node && node.position === 'right' && (
                              <node.node id={option?.value} />
                            )}
                          </div>
                          {deleteAction && (
                            <div
                              className="invisible absolute top-2 right-3 cursor-pointer p-1 group-hover:visible"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAction(option?.id ?? option.value);
                              }}
                            >
                              <Trash2 name="trash" color="red" size={18} />
                            </div>
                          )}
                        </CommandItem>
                      );
                    })}
                  </ScrollArea>
                )}
              </CommandGroup>
            </CommandList>
            {addButton && (
              <Button
                type="button"
                className={cn(
                  'align-center flex w-full items-center justify-center',
                  addButton.className,
                )}
                variant={addButton?.variant || 'secondary'}
                onClick={addButton.handleClick}
              >
                {addButton.icon ? (
                  <PlusIcon name={addButton.icon} size={18} color="#fff" />
                ) : (
                  <PlusIcon size={18} strokeWidth={1.8} className="mx-1" />
                )}
                <p className={addButton.icon && 'px-2'}>{addButton?.label}</p>
              </Button>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

SelectMultiple.displayName = 'SelectMultiple';
