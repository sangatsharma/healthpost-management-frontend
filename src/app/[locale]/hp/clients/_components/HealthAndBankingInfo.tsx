import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { mapEnumToOptions } from '@/lib/utils';
import { THealthInfoSchema } from '@/schemas/healthpostPortal/clients.schema';
import {
  BloodGroup,
  DisabilityIdentityType,
  DisabilityType,
} from '@/types/user.types';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useFormContext } from 'react-hook-form';

export default function HealthAndBankingInfo() {
  const form = useFormContext<THealthInfoSchema>();
  const t = useTypedTranslations('ClientRegistration');
  const p = useTypedTranslations('Placeholder');
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          {t('healthInfo.healthInformation')}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormWrapper label={t('healthInfo.bloodGroup')} isRequired>
                <FormSelect
                  options={mapEnumToOptions(BloodGroup)}
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
                  options={mapEnumToOptions(DisabilityType)}
                  placeholder={p('disabilityType')}
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
              <FormWrapper label={t('healthInfo.disabilityIdentityType')}>
                <FormSelect
                  options={mapEnumToOptions(DisabilityIdentityType)}
                  placeholder={p('disabilityIdentityType')}
                  {...field}
                  required
                  variant="basic"
                  error={!!form.formState.errors.disabilityIdentityType}
                />
              </FormWrapper>
            )}
          />
          {/* //Todo - Add a field forbelow entities
              isVaccineCompleted: z.boolean().optional(),
              isMinor: z.boolean().optional(),
              isEligibleForSgc: z.boolean().optional(), */}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          {t('healthInfo.bankingInformation')}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
