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
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useFormContext } from 'react-hook-form';

export default function HealthAndBankingInfo() {
  const form = useFormContext<THealthInfoSchema>();
  const t = useTypedTranslations('ClientRegistration');
  const p = useTypedTranslations('Placeholder');
  const tEnumKeys = useTypedTranslations('Enums');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          {t('healthInfo.healthInformation')}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.bloodGroup')} isRequired>
                <FormSelect
                  options={mapEnumToOptions(
                    BloodGroup,
                    tEnumKeys,
                    'bloodGroup',
                  )}
                  placeholder={p('bloodGroup')}
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
              <FormWrapper label={t('healthInfo.height')}>
                <Input {...field} placeholder={p('height')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.weight')}>
                <Input {...field} placeholder={p('weight')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="disabilityType"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.disabilityType')}>
                <FormSelect
                  {...field}
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={mapEnumToOptions(
                    DisabilityType,
                    tEnumKeys,
                    'disabilityType',
                  )}
                  placeholder={p('disabilityType')}
                  variant="searchable"
                  required={false}
                  error={!!form.formState.errors.disabilityType}
                />
              </FormWrapper>
            )}
          />

          <FormField
            control={form.control}
            name="disabilityIdentityType"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.disabilityIdentityType')}>
                <FormSelect
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  options={mapEnumToOptions(
                    DisabilityIdentityType,
                    tEnumKeys,
                    'disabilityIdentityType',
                  )}
                  placeholder={p('disabilityIdentityType')}
                  variant="searchable"
                  required={false}
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
                  label: t('healthInfo.isVaccineCompleted'),
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
                  label: t('healthInfo.isMinor'),
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
                  label: t('healthInfo.isEligibleForSgc'),
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
                          {t('healthInfo.isEligibleForSgcTooltip')}
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
          {t('healthInfo.bankingInformation')}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.bank')}>
                <Input {...field} placeholder={p('bank')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="bankBranch"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.bankBranch')}>
                <Input {...field} placeholder={p('bankBranch')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="bankAccountNumber"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.bankAccountNumber')}>
                <Input {...field} placeholder={p('bankAccountNumber')} />
              </FormWrapper>
            )}
          />
        </div>
      </div>
    </div>
  );
}
