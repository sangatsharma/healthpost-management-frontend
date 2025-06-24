import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Form, FormField } from '@/components/ui/form';
import FormDialog from '@/components/reusables/form-dialog';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchHealthPostInfo,
  fetchStaffInfo,
  mutateStaffInfo,
} from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/reusables/form-wrapper';
import { PhoneInput } from '@/components/ui/phone-input';

import { FileUploader } from '@/components/reusables/image-uploader';
import { getStaffSchema, TStaffSchema } from '@/schemas/admin.schema';
import { Gender, Status, TUser, UserRole, UserType } from '@/types/user.types';
import { convertToFormData, mapEnumToOptions } from '@/lib/utils';
import { PermissionSelector } from './PermissionForm';
import { FormSelect } from '@/components/reusables/form-select';
import { THealthPost } from '@/types/healthpost.types';

type TProps = {
  isOpen: boolean;
  toggleModal: () => void;
  staffId?: string;
};

export const AddAdminModal: React.FC<TProps> = ({
  isOpen,
  staffId,
  toggleModal,
}) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: queryKeys.staff.singleStaff(staffId || ''),
    queryFn: () =>
      fetchStaffInfo({
        staffId: staffId!,
      }),
    enabled: !!staffId,
  });

  const singleData = data?.data as TUser;
  const formValues = {
    firstName: singleData?.fullName?.firstName,
    middleName: singleData?.fullName?.middleName,
    lastName: singleData?.fullName?.lastName,
    profileImages: [singleData?.profileImage],
    ...singleData,
  } as TStaffSchema;

  const { data: healthpostsOptions, isSuccess: isHealthPostOptionsSuccess } =
    useQuery({
      queryKey: queryKeys.healthPost.healthPosts,
      queryFn: async () =>
        fetchHealthPostInfo({
          healthPostId: undefined,
        }),
      select: (data) =>
        (data?.data as THealthPost[]).map((hp) => ({
          label: hp.name,
          value: hp.id,
        })),
    });

  const { mutate: mutateStaff, isPending } = useMutation({
    mutationKey: staffId
      ? queryKeys.staff.singleStaff(staffId)
      : queryKeys.staff.staffs,
    mutationFn: mutateStaffInfo,
    retry: false,
    onSuccess: () => {
      toast.success(`Staff ${staffId ? 'updated' : 'created'} successfully!`);
      handleExit();
    },
  });

  const t = useTypedTranslations('Validation');
  const staffSchema = getStaffSchema(t);

  console.log('formValues', formValues);
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
      profileImages: [],
    },
    values:
      staffId && !isLoading && isSuccess && singleData ? formValues : undefined,
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = form;

  const onSubmit = (data: TStaffSchema): void => {
    const { profileImages: _images, ...dataWithoutImages } = data;
    mutateStaff({
      staffId: staffId!,
      data: convertToFormData(
        dataWithoutImages,
        ['profileImages'],
        staffId ? dirtyFields : undefined,
      ),
      method: staffId ? 'PUT' : 'POST',
    });
  };

  const handleExit = (): void => {
    reset();
    toggleModal();
  };

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
                  <FormWrapper label="Select Healthpost">
                    <FormSelect
                      options={
                        (isHealthPostOptionsSuccess && healthpostsOptions) || []
                      }
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
