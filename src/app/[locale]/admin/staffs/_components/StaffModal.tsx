import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import FormDialog from '@/components/reusables/form-dialog';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { fetchHealthPostInfo, fetchStaffInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/reusables/form-wrapper';
import { PhoneInput } from '@/components/ui/phone-input';

import { FileUploader } from '@/components/reusables/image-uploader';
import { Gender, Status, TUser, UserRole, UserType } from '@/types/user.types';
import { convertToFormData, mapEnumToOptions } from '@/lib/utils';
import { PermissionSelector } from './PermissionForm';
import { FormSelect } from '@/components/reusables/form-select';
import { THealthPost } from '@/types/healthpost.types';
import {
  getStaffSchema,
  TStaffSchema,
} from '@/schemas/adminPortal/admin.schema';
import { useStaffMutation } from '@/api/mutation';
import { useQuery } from '@tanstack/react-query';

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
  const { data, isLoading, isSuccess, isError, refetch } = useQuery({
    queryKey: queryKeys.staff.singleStaff(staffId || ''),
    queryFn: () =>
      fetchStaffInfo({
        staffId: staffId!,
      }),
    enabled: !!staffId,
  });

  const singleData = data?.data as TUser;
  const formValues = {
    firstName: singleData?.fullName?.firstName || '',
    middleName: singleData?.fullName?.middleName || '',
    lastName: singleData?.fullName?.lastName || '',
    profileImage: singleData?.profileImage || [],
    accountType: singleData?.accountType || '',
    email: singleData?.email,
    phoneNumber: singleData?.phoneNumber || '',
    gender: singleData?.gender || '',
    permissions: singleData?.permissions || [],
    status: singleData?.status || '',
    role: singleData?.role || '',
    healthPostId: singleData?.healthPostId || '',
  } as TStaffSchema;

  const { data: healthpostsOptions, isSuccess: isHealthPostOptionsSuccess } =
    useQuery({
      queryKey: queryKeys.healthPost.healthPosts,
      queryFn: async () => fetchHealthPostInfo({}),
      select: (data) =>
        (data?.data as THealthPost[]).map((hp) => ({
          label: hp.name,
          value: hp.id,
        })),
    });

  const { mutateStaff, isPending } = useStaffMutation({
    onSuccess: () => {
      toast.success(tToast(staffId ? 'staffUpdated' : 'staffCreated'));
      handleExit();
    },
  });

  const t = useTypedTranslations('Validation');
  const t2 = useTypedTranslations('GeneralPages');
  const tToast = useTypedTranslations('Toast');
  const tPlaceholder = useTypedTranslations('Placeholder');
  const tEnumKeys = useTypedTranslations('Enums');
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
      profileImage: [],
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
    const { permissions, ...dataToSend } = data;
    mutateStaff({
      staffId: staffId!,
      data: convertToFormData(
        {
          ...dataToSend,
          permissions: JSON.stringify(permissions),
        },
        ['profileImage'],
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
        title={staffId ? t2('User.editStaff') : t2('User.addStaff')}
        className="sm:max-w-lg md:max-w-fit"
        isFormDirty={Object.keys(dirtyFields).length > 0}
        mutateAction={{
          label: staffId ? t2('User.editStaff') : t2('User.addStaff'),
          isLoading: isPending,
          onClick: handleSubmit(onSubmit),
          disabled: !Object.keys(dirtyFields).length,
          className: 'rounded-sm',
        }}
        resetAction={{
          label: t2('reset'),
          onClick: () => reset(),
          className: 'font-normal hover:bg-transparent',
        }}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
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
                  <FormWrapper label={t2('User.firstName')} isRequired>
                    <Input
                      {...field}
                      placeholder={tPlaceholder('firstName')}
                      autoFocus
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormWrapper label={t2('User.middleName')}>
                    <Input
                      {...field}
                      placeholder={tPlaceholder('middleName')}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormWrapper label={t2('User.lastName')} isRequired>
                    <Input {...field} placeholder={tPlaceholder('lastName')} />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormWrapper label={t2('User.email')} isRequired>
                    <Input
                      {...field}
                      placeholder={tPlaceholder('email')}
                      required
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormWrapper label={t2('HealthPost.phone')} isRequired>
                    <PhoneInput
                      {...field}
                      defaultCountry="NP"
                      placeholder={tPlaceholder('phone')}
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
                  <FormWrapper label={t2('User.gender')} isRequired>
                    <FormSelect
                      options={mapEnumToOptions(Gender, tEnumKeys, 'gender')}
                      placeholder={tPlaceholder('selectGender')}
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
                  <FormWrapper label={t2('HealthPost.status')} isRequired>
                    <FormSelect
                      options={mapEnumToOptions(Status, tEnumKeys, 'status')}
                      placeholder={tPlaceholder('selectStatus')}
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
                  <FormWrapper label={t2('User.role')} isRequired>
                    <FormSelect
                      options={mapEnumToOptions(
                        UserRole,
                        tEnumKeys,
                        'userRole',
                      )}
                      placeholder={tPlaceholder('selectRole')}
                      {...field}
                      required
                      variant="basic"
                      error={!!form.formState.errors.role}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormWrapper label={t2('User.accountType')} isRequired>
                    <FormSelect
                      options={mapEnumToOptions(
                        UserType,
                        tEnumKeys,
                        'userType',
                      )}
                      placeholder={tPlaceholder('selectAccountType')}
                      {...field}
                      required
                      variant="basic"
                      error={!!form.formState.errors.accountType}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="healthPostId"
                render={({ field }) => (
                  <FormWrapper label={t2('SidebarItems.healthpost')}>
                    <FormSelect
                      options={
                        (isHealthPostOptionsSuccess && healthpostsOptions) || []
                      }
                      placeholder={tPlaceholder('selectHealthPost')}
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
                name="profileImage"
                render={({ field }) => (
                  <FormWrapper label={t2('images')}>
                    <FileUploader
                      defaultValue={field.value || []}
                      allowFile={false}
                      allowImage
                      maxFiles={2}
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
