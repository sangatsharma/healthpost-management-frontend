import { cn } from '@/lib/utils';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

type FormFieldProps = {
  label?: string;
  isRequired?: boolean;
  className?: string;
  children: React.ReactNode;
  showSwitch?: {
    label: string;
    checked: boolean;
    onChange: (e: boolean) => void;
  };
};

const FormWrapper: React.FC<FormFieldProps> = ({
  label,
  children,
  className,
  isRequired = false,
  showSwitch,
}) => {
  return (
    <FormItem className={cn('space-y-2', className)}>
      <div className="my-0 flex items-center justify-between py-0">
        {label && (
          <FormLabel className="mb-2 flex items-start gap-x-[0.5px] pl-1 font-medium">
            {label}
            {isRequired ? (
              <span className="text-xs leading-[8px] font-thin text-red-500">
                *
              </span>
            ) : null}
          </FormLabel>
        )}
        {showSwitch && (
          <div className="flex items-center space-x-2">
            <Label htmlFor={showSwitch.label} className="text-xs font-normal">
              {showSwitch.label}
            </Label>
            <Switch
              id={showSwitch.label}
              checked={showSwitch.checked}
              onCheckedChange={showSwitch.onChange}
            />
          </div>
        )}
      </div>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormWrapper;
