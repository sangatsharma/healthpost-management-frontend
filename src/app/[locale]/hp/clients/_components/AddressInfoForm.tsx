import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TAddressInfoSchema } from '@/schemas/healthpostPortal/clients.schema';
import { useFormContext } from 'react-hook-form';

export default function AddressInfoForm() {
  const form = useFormContext<TAddressInfoSchema>();
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-lg font-semibold">Permanent Address</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name="districtId"
            render={({ field }) => (
              <FormWrapper label="Enter District" isRequired>
                <Input {...field} placeholder="Enter District" autoFocus />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="palityId"
            render={({ field }) => (
              <FormWrapper label="Enter Municipality" isRequired>
                <Input {...field} placeholder="Enter Municipality" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="wardNo"
            render={({ field }) => (
              <FormWrapper label={'Ward number'} isRequired>
                <Input type="number" {...field} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tole"
            render={({ field }) => (
              <FormWrapper label="Enter tole" isRequired>
                <Input {...field} placeholder="Enter tole" />
              </FormWrapper>
            )}
          />
        </div>
      </section>
      <section>
        <section className="mb-4 flex justify-start gap-4">
          <span className="text-lg font-semibold">
            Temporary Address (Optional)
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
            Same as Permanent Address
          </span>
        </section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <FormField
            control={form.control}
            name="tDistrictId"
            render={({ field }) => (
              <FormWrapper label="Enter District">
                <Input {...field} placeholder="Enter District" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tPalityId"
            render={({ field }) => (
              <FormWrapper label="Enter Municipality">
                <Input {...field} placeholder="Enter Municipality" />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tWardNo"
            render={({ field }) => (
              <FormWrapper label={'Ward number'}>
                <Input type="number" {...field} />
              </FormWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="tTole"
            render={({ field }) => (
              <FormWrapper label="Enter tole">
                <Input {...field} placeholder="Enter tole" />
              </FormWrapper>
            )}
          />
        </div>
      </section>
    </div>
  );
}
