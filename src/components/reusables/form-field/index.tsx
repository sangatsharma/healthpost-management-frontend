'use client';

import { forwardRef } from 'react';
import { TextField } from './text-field';
import { TextareaField } from './textarea-field';
import { SelectField } from './select-field';
import { DropdownField } from './dropdown-field';
import { CheckboxField } from './checkbox-field';
import { SwitchField } from './switch-field';
import { RadioField } from './radio-field';
import { FileField } from './file-field';
import { SliderField } from './slider-field';
import { FormFieldProps } from '@/types/formField.types';

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (props, ref) => {
    const { type = 'text' } = props;

    switch (type) {
      case 'textarea':
        return <TextareaField {...props} ref={ref} />;
      case 'select':
        return <SelectField {...props} ref={ref} />;
      case 'dropdown':
        return <DropdownField {...props} ref={ref} />;
      case 'checkbox':
        return <CheckboxField {...props} ref={ref} />;
      case 'switch':
        return <SwitchField {...props} ref={ref} />;
      case 'radio':
        return <RadioField {...props} ref={ref} />;
      case 'file':
        return <FileField {...props} ref={ref} />;
      case 'slider':
        return <SliderField {...props} ref={ref} />;
      default:
        return <TextField {...props} type={type} ref={ref} />;
    }
  },
);

FormField.displayName = 'FormField';

export default FormField;

// Export all field components
export { TextField } from './text-field';
export { TextareaField } from './textarea-field';
export { SelectField } from './select-field';
export { DropdownField } from './dropdown-field';
export { CheckboxField } from './checkbox-field';
export { SwitchField } from './switch-field';
export { RadioField } from './radio-field';
export { FileField } from './file-field';
export { SliderField } from './slider-field';
