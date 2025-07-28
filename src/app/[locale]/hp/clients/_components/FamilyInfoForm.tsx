import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { mapEnumToOptions } from '@/lib/utils';
import { TFamilyInfoSchema } from '@/schemas/healthpostPortal/clients.schema';
import { MarriageStatus } from '@/types/user.types';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useFormContext } from 'react-hook-form';

export default function FamilyInfoForm() {
  const form = useFormContext<TFamilyInfoSchema>();
  const t = useTypedTranslations('ClientRegistration');
  const p = useTypedTranslations('Placeholder');
  const tEnumKeys = useTypedTranslations('Enums');
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <FormField
        control={form.control}
        name="fatherName"
        render={({ field }) => (
          <FormWrapper label={t('familyInfo.fatherName')} isRequired>
            <Input {...field} placeholder={p('fatherName')} autoFocus />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="motherName"
        render={({ field }) => (
          <FormWrapper label={t('familyInfo.motherName')} isRequired>
            <Input {...field} placeholder={p('motherName')} />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="guardianName"
        render={({ field }) => (
          <FormWrapper label={t('familyInfo.guardianName')}>
            <Input {...field} placeholder={p('guardianName')} />
          </FormWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="maritalStatus"
        render={({ field }) => (
          <FormWrapper label={t('familyInfo.maritalStatus')} isRequired>
            <FormSelect
              options={mapEnumToOptions(
                MarriageStatus,
                tEnumKeys,
                'marriageStatus',
              )}
              placeholder={p('maritalStatus')}
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
          <FormWrapper label={t('familyInfo.spouseName')}>
            <Input {...field} placeholder={p('spouseName')} />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="familyHistory"
        render={({ field }) => (
          <FormWrapper label={t('familyInfo.familyHistory')}>
            <Input {...field} placeholder={t('familyInfo.familyHistory')} />
          </FormWrapper>
        )}
      />
    </div>
  );
}
