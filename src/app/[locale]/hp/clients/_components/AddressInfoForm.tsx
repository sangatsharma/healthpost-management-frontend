import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TAddressInfoSchema } from '@/schemas/healthpostPortal/clients.schema';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useFormContext } from 'react-hook-form';

export default function AddressInfoForm() {
  const form = useFormContext<TAddressInfoSchema>();
  const t = useTypedTranslations('ClientRegistration');
  const p = useTypedTranslations('Placeholder');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-lg font-semibold">
          {t('addressInfo.permanentAddress')}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name="districtId"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.district')} isRequired>
                <Input {...field} placeholder={p('district')} autoFocus />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="palityId"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.municipality')} isRequired>
                <Input {...field} placeholder={p('municipality')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="wardNo"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.wardNumber')} isRequired>
                <Input type="number" {...field} placeholder={p('wardNumber')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tole"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.tole')} isRequired>
                <Input {...field} placeholder={p('tole')} />
              </FormWrapper>
            )}
          />
        </div>
      </section>
      <section>
        <section className="mb-4 flex justify-start gap-4">
          <span className="text-lg font-semibold">
            {t('addressInfo.temporaryAddress')}
          </span>
          <span className="flex items-center gap-2 text-xs">
            <Switch
              onCheckedChange={(val) => {
                if (val) {
                  form.setValue('tDistrictId', form.getValues('districtId'));
                  form.setValue('tPalityId', form.getValues('palityId'));
                  form.setValue('tWardNo', form.getValues('wardNo'));
                  form.setValue('tTole', form.getValues('tole'));
                } else {
                  form.setValue('tDistrictId', '');
                  form.setValue('tPalityId', '');
                  form.setValue('tWardNo', '');
                  form.setValue('tTole', '');
                }
              }}
            />
            {t('addressInfo.sameAsPerm')}
          </span>
        </section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <FormField
            control={form.control}
            name="tDistrictId"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.district')}>
                <Input {...field} placeholder={p('district')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tPalityId"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.municipality')}>
                <Input {...field} placeholder={p('municipality')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tWardNo"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.wardNumber')}>
                <Input type="number" {...field} placeholder={p('wardNumber')} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tTole"
            render={({ field }) => (
              <FormWrapper label={t('addressInfo.tole')}>
                <Input {...field} placeholder={p('tole')} />
              </FormWrapper>
            )}
          />
        </div>
      </section>
    </div>
  );
}
