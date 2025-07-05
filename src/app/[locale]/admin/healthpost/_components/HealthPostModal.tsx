import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Form, FormField } from '@/components/ui/form';
import FormDialog from '@/components/reusables/form-dialog';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

import { useQuery } from '@tanstack/react-query';
import { fetchHealthPostInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/reusables/form-wrapper';
import { PhoneInput } from '@/components/ui/phone-input';

import { FileUploader } from '@/components/reusables/image-uploader';
import { Status } from '@/types/user.types';
import { convertToFormData, mapEnumToOptions } from '@/lib/utils';
import { useHealthPostMutation } from '@/api/mutation';
import { FormSelect } from '@/components/reusables/form-select';
import { toast } from 'sonner';
import {
  getHealthPostSchema,
  THealthPostSchema,
} from '@/schemas/adminPortal/healthPost.schema';

type TProps = {
  isOpen: boolean;
  toggleModal: () => void;
  healthPostId?: string;
};

export const AddHealthPostModal: React.FC<TProps> = ({
  isOpen,
  toggleModal,
  healthPostId,
}) => {
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.healthPost.singleHealthPost(healthPostId || ''),
    queryFn: () =>
      fetchHealthPostInfo({
        healthPostId: healthPostId!,
      }),
    enabled: !!healthPostId,
  });

  const handleExit = (): void => {
    reset();
    toggleModal();
  };

  const { mutateHealthPost, isPending } = useHealthPostMutation({
    onSuccess: () => {
      handleExit();
      toast.success(
        `Health Post ${healthPostId ? 'updated' : 'created'} successfully!`,
      );
    },
  });

  const t = useTypedTranslations('Validation');
  const t2 = useTypedTranslations('GeneralPages');
  const tPlaceholder = useTypedTranslations('Placeholder');

  const HealthPostSchema = getHealthPostSchema(t);

  const form = useForm<THealthPostSchema>({
    resolver: zodResolver(HealthPostSchema),
    defaultValues: {
      name: '',
      location: '',
      images: [],
      email: '',
      phone: '',
      municipality: '',
      status: Status.ACTIVE,
      wardNo: '',
    },
    values:
      healthPostId &&
      !rest.isLoading &&
      rest.isSuccess &&
      data?.data &&
      !Array.isArray(data.data)
        ? (data?.data as THealthPostSchema)
        : undefined,
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = form;
  const onSubmit = (data: THealthPostSchema): void => {
    mutateHealthPost({
      healthPostId: healthPostId || undefined,
      data: convertToFormData(
        data,
        ['images'],
        healthPostId ? dirtyFields : undefined,
      ),
      method: healthPostId ? 'PUT' : 'POST',
    });
  };

  return (
    <React.Fragment>
      <FormDialog
        isOpen={isOpen}
        toggleModal={handleExit}
        title={
          healthPostId
            ? t2('HealthPost.editHealthPost')
            : t2('HealthPost.addHealthPost')
        }
        className="sm:max-w-lg md:max-w-fit"
        isFormDirty={Object.keys(dirtyFields).length > 0}
        mutateAction={{
          label: healthPostId
            ? t2('HealthPost.editHealthPost')
            : t2('HealthPost.addHealthPost'),
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
        isLoading={rest.isLoading}
        isError={rest.isError}
        refetch={rest.refetch}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full grid-cols-2 gap-4 px-1 xl:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormWrapper label={t2('HealthPost.name')} isRequired>
                    <Input
                      {...field}
                      placeholder={tPlaceholder('fullName')}
                      autoFocus
                      required
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormWrapper label={t2('HealthPost.email')} isRequired>
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
                name="municipality"
                render={({ field }) => (
                  <FormWrapper label={t2('HealthPost.municipality')} isRequired>
                    <Input
                      {...field}
                      placeholder={tPlaceholder('municipality')}
                      required
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormWrapper label={t2('HealthPost.location')} isRequired>
                    <Input
                      {...field}
                      placeholder={tPlaceholder('tole')}
                      required
                    />
                  </FormWrapper>
                )}
              />

              {healthPostId && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormWrapper label={t2('HealthPost.status')} isRequired>
                      {' '}
                      <FormSelect
                        options={mapEnumToOptions(Status)}
                        placeholder={tPlaceholder('selectStatus')}
                        {...field}
                        required
                        variant="basic"
                        error={!!form.formState.errors.status}
                      />
                    </FormWrapper>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="wardNo"
                render={({ field }) => (
                  <FormWrapper label={t2('HealthPost.wardNo')} isRequired>
                    <Input
                      type="number"
                      placeholder={tPlaceholder('wardNumber')}
                      {...field}
                    />
                  </FormWrapper>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
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
                    />
                  </FormWrapper>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormWrapper label={t2('images')} isRequired>
                      <FileUploader
                        onChange={field.onChange}
                        defaultValue={field.value || []}
                        allowFile={true}
                        allowImage
                        showPreview
                        maxFiles={5}
                        maxSize={10 * 1024 * 1024} // 10MB
                        name="images"
                      />
                    </FormWrapper>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </FormDialog>
    </React.Fragment>
  );
};
