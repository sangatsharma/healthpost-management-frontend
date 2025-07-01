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
import 'nepali-datepicker-reactjs/dist/index.css';

export default function PersonalInfoForm() {
  const form = useFormContext<TPersonalInfoSchema & TSystemInfoSchema>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormWrapper label="First Name" isRequired>
            <Input {...field} placeholder="Enter First Name" autoFocus />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="middleName"
        render={({ field }) => (
          <FormWrapper label="Middle Name">
            <Input {...field} placeholder="Enter Middle Name" />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormWrapper label="Last Name" isRequired>
            <Input {...field} placeholder="Enter Last Name" />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="casteType"
        render={({ field }) => (
          <FormWrapper label="Caste Type" isRequired>
            <FormSelect
              options={mapEnumToOptions(CasteType)}
              placeholder="Select caste Type"
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
          <FormWrapper label="Gender" isRequired>
            <FormSelect
              options={mapEnumToOptions(Gender)}
              placeholder="Select gender"
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
          <FormWrapper label="Status" isRequired>
            <FormSelect
              options={mapEnumToOptions(Status)}
              placeholder="Select status"
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
        render={({ field }) => (
          <FormWrapper label="Email" isRequired>
            <Input {...field} placeholder="Enter Email" required />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormWrapper label="Phone Number" isRequired>
            <PhoneInput
              {...field}
              defaultCountry="NP"
              placeholder="Enter Phone Number"
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
          <FormWrapper label="Enter date of birth" isRequired>
            <NepaliDatePicker
              inputClassName="form-control w-full h-10 px-3 py-2"
              className="focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 focus-visible:ring-[3px]"
              options={{
                calenderLocale: 'ne',
                valueLocale: 'ne',
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
          <FormWrapper label="Nationality" isRequired>
            <FormSelect
              options={mapEnumToOptions(Nationality)}
              placeholder="Select status"
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
        render={({ field }) => (
          <FormWrapper label="Citizenship number">
            <Input {...field} placeholder="Enter citizenship number" />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="nationalId"
        render={({ field }) => (
          <FormWrapper label="National Id number">
            <Input {...field} placeholder="Enter national Id number" />
          </FormWrapper>
        )}
      />
      <FormField
        control={form.control}
        name="emergencyContact"
        render={({ field }) => (
          <FormWrapper label="Emergency contact Number" isRequired>
            <PhoneInput
              {...field}
              defaultCountry="NP"
              placeholder="Enter Phone Number"
              required
              countrySelectProps={{
                disabled: true,
              }}
              error={!!form.formState.errors.emergencyContact}
            />
          </FormWrapper>
        )}
      />
      <div className="col-span-3 flex w-full flex-col gap-4">
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormWrapper label="Images">
              <FileUploader
                defaultValue={field.value || []}
                allowFile={false}
                allowImage
                showPreview
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
