import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Form, FormField } from '@/components/ui/form';
import FormDialog from '@/components/reusables/form-dialog';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import {} from '@/schemas/healthPost.schema';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchStaffInfo, mutateStaffInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/reusables/form-wrapper';
import { PhoneInput } from '@/components/ui/phone-input';

import { FileUploader } from '@/components/reusables/image-uploader';
import { getStaffSchema, TStaffSchema } from '@/schemas/admin.schema';
import { Gender, Status, UserRole, UserType } from '@/types/user.types';
import { mapEnumToOptions } from '@/lib/utils';
import { PermissionSelector } from './PermissionForm';
import { FormSelect } from '@/components/reusables/form-select';

type TProps = {
  isOpen: boolean;
  toggleModal: () => void;
};

export const AddAdminModal: React.FC<TProps> = ({ isOpen, toggleModal }) => {
  const searchParams = useSearchParams();
  const staffId = searchParams.get('staffId');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.staff.singleStaff(staffId || ''),
    queryFn: () =>
      fetchStaffInfo({
        staffId: staffId!,
      }),
    enabled: !!staffId,
  });

  const { mutate: mutateStaff, isPending } = useMutation({
    mutationKey: staffId
      ? queryKeys.staff.singleStaff(staffId)
      : queryKeys.staff.staffs,
    mutationFn: mutateStaffInfo,
    retry: false,
    onSuccess: () => {
      toast.success(`Staff ${staffId ? 'updated' : 'created'} successfully!`);
    },
  });

  const t = useTypedTranslations('Validation');
  const staffSchema = getStaffSchema(t);

  const form = useForm<TStaffSchema>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      accountType: UserType.HP,
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      permissions: [],
      gender: undefined,
      status: undefined,
      profileImages: [
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      ],
    },
    values: staffId && !isLoading ? (data as TStaffSchema) : undefined,
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = form;

  const onSubmit = (data: TStaffSchema): void => {
    console.log('Form Data:', data);
    return;
    mutateStaff({
      staffId: staffId!,
      data,
      method: staffId ? 'PUT' : 'POST',
    });
    reset();
    toggleModal();
  };

  const handleExit = (): void => {
    reset();
    toggleModal();
  };
  console.log('images', form.watch());

  return (
    <React.Fragment>
      <FormDialog
        isOpen={isOpen}
        toggleModal={handleExit}
        title={staffId ? 'Update Staff' : 'Add New Staff'}
        className="sm:max-w-lg md:max-w-fit"
        isFormDirty={Object.keys(dirtyFields).length > 0}
        mutateAction={{
          label: staffId ? 'Update Staff' : 'Add Staff',
          isLoading: isPending,
          onClick: handleSubmit(onSubmit),
          disabled: !Object.keys(dirtyFields).length,
          className: 'rounded-sm',
        }}
        resetAction={{
          label: 'Reset',
          onClick: () => reset(),
          className: 'font-normal hover:bg-transparent',
        }}
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-4 p-2"
          >
            <div className="mx-auto grid w-[45vw] grid-cols-3 items-center gap-4 gap-x-8 pl-2 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormWrapper label="First Name" isRequired>
                    <Input
                      {...field}
                      placeholder="Enter First Name"
                      autoFocus
                    />
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
                name="role"
                render={({ field }) => (
                  <FormWrapper label="Role" isRequired>
                    <FormSelect
                      options={mapEnumToOptions(UserRole)}
                      placeholder="Select role"
                      {...field}
                      required
                      variant="searchable"
                      error={!!form.formState.errors.role}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="healthPostId"
                render={({ field }) => (
                  <FormWrapper label="Select Healthpost" isRequired>
                    <FormSelect
                      options={[
                        {
                          label: 'admin1',
                          value: 'e51ad8ea-9ed9-4a7b-821c-942a39b0fe4b',
                        },
                        { label: 'admin2', value: 'aasdasdas' },
                      ]}
                      placeholder="Select Healthpost"
                      {...field}
                      variant="searchable"
                      error={!!form.formState.errors.healthPostId}
                    />
                  </FormWrapper>
                )}
              />
            </div>
            <div className="col-span-2 flex w-full flex-col gap-4">
              <FormField
                control={form.control}
                name="profileImages"
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
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormWrapper isRequired>
                    <PermissionSelector {...field} />
                  </FormWrapper>
                )}
              />
            </div>
          </form>
        </Form>
      </FormDialog>
    </React.Fragment>
  );
};
