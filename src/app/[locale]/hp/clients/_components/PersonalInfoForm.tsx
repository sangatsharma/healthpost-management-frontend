import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { mapEnumToOptions } from '@/lib/utils';
import {
  TPersonalInfoSchema,
  TSystemInfoSchema,
} from '@/schemas/healthpostPortal/clients.schema';
import { CasteType, Gender, Nationality, Status } from '@/types/user.types';
import { useFormContext } from 'react-hook-form';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { FileUploader } from '@/components/reusables/image-uploader';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import 'nepali-datepicker-reactjs/dist/index.css';

export default function PersonalInfoForm() {
  const form = useFormContext<TPersonalInfoSchema & TSystemInfoSchema>();
  const t = useTypedTranslations('ClientRegistration');
  const p = useTypedTranslations('Placeholder');

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field, formState }) => (
          <FormWrapper label={t('personalInfo.firstName')} isRequired>
            <Input
              {...field}
              placeholder={p('firstName')}
              autoFocus
              errors={formState.errors.firstName}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="middleName"
        render={({ field, formState }) => (
          <FormWrapper label={t('personalInfo.middleName')}>
            <Input
              {...field}
              placeholder={p('middleName')}
              errors={formState.errors.middleName}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field, formState }) => (
          <FormWrapper label={t('personalInfo.lastName')} isRequired>
            <Input
              {...field}
              placeholder={p('lastName')}
              errors={formState.errors.lastName}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="casteType"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.casteType')} isRequired>
            <FormSelect
              options={mapEnumToOptions(CasteType)}
              placeholder={`${t('personalInfo.casteType')} `}
              {...field}
              required
              variant="basic"
              error={!!form.formState.errors.casteType}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.gender')} isRequired>
            <FormSelect
              options={mapEnumToOptions(Gender)}
              placeholder={p('selectGender')}
              {...field}
              required
              variant="basic"
              error={!!form.formState.errors.gender}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.status')} isRequired>
            <FormSelect
              options={mapEnumToOptions(Status)}
              placeholder={p('selectStatus')}
              {...field}
              required
              variant="basic"
              error={!!form.formState.errors.status}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field, formState }) => (
          <FormWrapper label={t('personalInfo.email')} isRequired>
            <Input
              {...field}
              placeholder={p('email')}
              required
              errors={formState.errors.email}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.phoneNumber')} isRequired>
            <PhoneInput
              {...field}
              defaultCountry="NP"
              placeholder={p('phone')}
              required
              countrySelectProps={{
                disabled: true,
              }}
              error={!!form.formState.errors.phoneNumber}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="dobBs"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.dateOfBirth')} isRequired>
            <NepaliDatePicker
              inputClassName="w-full h-10 px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-background border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 focus-visible:ring-[3px] outline-none"
              className=""
              options={{
                calenderLocale: 'ne',
                valueLocale: 'en',
                closeOnSelect: true,
              }}
              todayIfEmpty
              minYear={1950}
              {...field}
            />
          </FormWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.nationality')} isRequired>
            <FormSelect
              options={mapEnumToOptions(Nationality)}
              placeholder={`${t('personalInfo.nationality')}`}
              {...field}
              required
              variant="basic"
              error={!!form.formState.errors.status}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="citizenshipNumber"
        render={({ field, formState }) => (
          <FormWrapper label={t('personalInfo.citizenshipNumber')}>
            <Input
              {...field}
              placeholder={p('citizenshipNumber')}
              errors={formState.errors.citizenshipNumber}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="nationalId"
        render={({ field, formState }) => (
          <FormWrapper label={t('personalInfo.nationalId')}>
            <Input
              {...field}
              placeholder={p('nationalId')}
              errors={formState.errors.nationalId}
            />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="emergencyContact"
        render={({ field }) => (
          <FormWrapper label={t('personalInfo.emergencyContact')} isRequired>
            <PhoneInput
              {...field}
              defaultCountry="NP"
              placeholder={p('phone')}
              required
              countrySelectProps={{
                disabled: true,
              }}
              error={!!form.formState.errors.emergencyContact}
            />
          </FormWrapper>
        )}
      />
      <div className="col-span-4 flex w-full flex-col gap-4">
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormWrapper label={t('personalInfo.profileImage')}>
              <FileUploader
                defaultValue={field.value || []}
                allowImage
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
                uploaderType="dropzone"
                {...field}
              />
            </FormWrapper>
          )}
        />
      </div>
    </div>
  );
}
