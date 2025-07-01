import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { mapEnumToOptions } from '@/lib/utils';
import { TFamilyInfoSchema } from '@/schemas/healthpostPortal/clients.schema';
import { MarriageStatus } from '@/types/user.types';
import { useFormContext } from 'react-hook-form';

export default function FamilyInfoForm() {
  const form = useFormContext<TFamilyInfoSchema>();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <FormField
        control={form.control}
        name="fatherName"
        render={({ field }) => (
          <FormWrapper label="Enter father full name" isRequired>
            <Input {...field} placeholder="Enter father Name" autoFocus />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="motherName"
        render={({ field }) => (
          <FormWrapper label="Enter mother full name" isRequired>
            <Input {...field} placeholder="Enter mother Name" />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="guardianName"
        render={({ field }) => (
          <FormWrapper label="Enter guardian full name">
            <Input {...field} placeholder="Enter guardian Name" />
          </FormWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="maritalStatus"
        render={({ field }) => (
          <FormWrapper label="Marital Status" isRequired>
            <FormSelect
              options={mapEnumToOptions(MarriageStatus)}
              placeholder="Select Marital Status"
              {...field}
              required
              variant="basic"
              error={!!form.formState.errors.maritalStatus}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="spouseName"
        render={({ field }) => (
          <FormWrapper label="Enter spouse full name">
            <Input {...field} placeholder="Enter spouse Name" />
          </FormWrapper>
        )}
      />
    </div>
  );
}
