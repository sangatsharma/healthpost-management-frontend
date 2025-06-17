import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Form, FormField } from '@/components/ui/form';
import FormDialog from '@/components/reusables/form-dialog';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import {
  getHealthPostSchema,
  THealthPostSchema,
} from '@/schemas/healthPost.schema';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchHealthPostInfo, mutateHealthPostInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/reusables/form-wrapper';

type TProps = {
  isOpen: boolean;
  toggleModal: () => void;
};

export const AddHealthPostModal: React.FC<TProps> = ({
  isOpen,
  toggleModal,
}) => {
  const searchParams = useSearchParams();
  const healthPostId = searchParams.get('healthPostId');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.healthPost.singleHealthPost(healthPostId || ''),
    queryFn: () =>
      fetchHealthPostInfo({
        healthPostId,
      }),
    enabled: !!healthPostId,
  });

  const { mutate: mutateHealthPost, isPending } = useMutation({
    mutationKey: queryKeys.healthPost.healthPosts,
    mutationFn: mutateHealthPostInfo,
    retry: false,
    onSuccess: () => {
      toast.success(
        `Health Post ${healthPostId ? 'updated' : 'created'} successfully!`,
      );
    },
  });

  const t = useTypedTranslations('Validation');
  const HealthPostSchema = getHealthPostSchema(t);

  const form = useForm<THealthPostSchema>({
    resolver: zodResolver(HealthPostSchema),
    defaultValues: {
      name: '',
      location: '',
      adminId: '',
      email: '',
      phone: '',
      municipality: '',
      status: 'ACTIVE',
      createdAt: '',
      id: '',
    },
    values: healthPostId && !isLoading ? data : undefined,
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = form;

  const onSubmit = (data: THealthPostSchema): void => {
    mutateHealthPost({
      healthPostId: healthPostId || null,
      data: {
        ...data,
        id: healthPostId || undefined,
      },
    });
    reset();
    toggleModal();
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
        title={healthPostId ? 'Update HealthPost' : 'Add New HealthPost'}
        className="sm:max-w-lg md:max-w-fit"
        isFormDirty={Object.keys(dirtyFields).length > 0}
        mutateAction={{
          label: healthPostId ? 'Update Health Post' : 'Add Health Post',
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormWrapper label="Health Post Name" isRequired>
                    <Input
                      {...field}
                      placeholder="Enter Health Post Name"
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
                  <FormWrapper label="HealthPost Email" isRequired>
                    <Input {...field} placeholder="Enter Email" required />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormWrapper label="Municipality" isRequired>
                    <Input {...field} required />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormWrapper label="Location" isRequired>
                    <Input {...field} required />
                  </FormWrapper>
                )}
              />

              <FormField
                control={form.control}
                name="wardNo"
                render={({ field }) => (
                  <FormWrapper label="Ward No" isRequired>
                    <Input {...field} required />
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
