import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { mapEnumToOptions } from '@/lib/utils';
import { THealthInfoSchema } from '@/schemas/healthpostPortal/clients.schema';
import {
  BloodGroup,
  DisabilityIdentityType,
  DisabilityType,
} from '@/types/user.types';
import { Tooltip } from '@radix-ui/react-tooltip';
import { InfoIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export default function HealthAndBankingInfo() {
  const form = useFormContext<THealthInfoSchema>();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Health Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormWrapper label="Blood Group " isRequired>
                <FormSelect
                  options={mapEnumToOptions(BloodGroup)}
                  placeholder="Select Blood Group"
                  {...field}
                  required
                  variant="basic"
                  error={!!form.formState.errors.bloodGroup}
                />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormWrapper label="Enter height (CM)">
                <Input {...field} placeholder="Enter height" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormWrapper label="Enter Weight (KG)">
                <Input {...field} placeholder="Enter weight" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="disabilityType"
            render={({ field }) => (
              <FormWrapper label="Disability Type">
                <FormSelect
                  options={mapEnumToOptions(DisabilityType)}
                  placeholder="Select Disability Type"
                  {...field}
                  required
                  variant="basic"
                  error={!!form.formState.errors.disabilityType}
                />
              </FormWrapper>
            )}
          />

          <FormField
            control={form.control}
            name="disabilityIdentityType"
            render={({ field }) => (
              <FormWrapper label="Disability Identity Type">
                <FormSelect
                  options={mapEnumToOptions(DisabilityIdentityType)}
                  placeholder="Select Disability ID Type"
                  {...field}
                  required
                  variant="basic"
                  error={!!form.formState.errors.disabilityIdentityType}
                />
              </FormWrapper>
            )}
          />

          <FormField
            control={form.control}
            name="isVaccineCompleted"
            render={() => (
              <FormWrapper
                showSwitch={{
                  label: 'Is vaccine completed ?',
                  checked: form.watch('isVaccineCompleted') ?? false,
                  onChange: (val: boolean) =>
                    form.setValue('isVaccineCompleted', val),
                }}
                className="my-auto mt-3 flex h-full items-center gap-2"
              />
            )}
          />

          <FormField
            control={form.control}
            name="isMinor"
            render={() => (
              <FormWrapper
                showSwitch={{
                  label: 'Is Minor ?',
                  checked: form.watch('isMinor') ?? false,
                  onChange: (val: boolean) => form.setValue('isMinor', val),
                }}
                className="my-auto mt-3 flex h-full items-center gap-2"
              />
            )}
          />
          <FormField
            control={form.control}
            name="isEligibleForSgc"
            render={() => (
              <FormWrapper
                showSwitch={{
                  label: 'Is Elligible for SGC ?',
                  checked: form.watch('isEligibleForSgc') ?? false,
                  onChange: (val: boolean) =>
                    form.setValue('isEligibleForSgc', val),
                  node: (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="cursor-pointer ease-in hover:scale-110" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="text-xs font-medium"
                        >
                          This is for the clients who are eligible for Social
                          Grant Certificate (SGC) program.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ),
                  nodeSide: 'right',
                }}
                className="my-auto mt-3 flex h-full items-center gap-2"
              />
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Banking Information (Optional)
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormWrapper label="Enter Bank Name">
                <Input {...field} placeholder="Enter Bank Name" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="bankBranch"
            render={({ field }) => (
              <FormWrapper label="Enter Bank Branch">
                <Input {...field} placeholder="Enter Bank Branch" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="bankAccountNumber"
            render={({ field }) => (
              <FormWrapper label="Enter Bank number">
                <Input {...field} placeholder="Enter Bank number" />
              </FormWrapper>
            )}
          />
        </div>
      </div>
    </div>
  );
}
