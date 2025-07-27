'use client';
import { useOpdReferalMutation } from '@/api/mutation';
import { fetchHealthPostInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import FormDialog from '@/components/reusables/form-dialog';
import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { Form, FormField } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { renderFullName } from '@/lib/utils';
import { TReferalSchema } from '@/schemas/healthpostPortal/referral.schema';
import { THealthPost } from '@/types/healthpost.types';
import { TOpd } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const ReferalModal = ({
  opd,
  isOpen,
  handleExit,
}: {
  opd: TOpd;
  isOpen: boolean;
  handleExit: () => void;
}) => {
  const { user } = useUserStore();
  const t = useTypedTranslations('Referral');
  const t2 = useTypedTranslations('GeneralPages');
  const tPlaceholder = useTypedTranslations('Placeholder');
  const form = useForm<TReferalSchema>({
    defaultValues: {
      staffId: user?.id || '',
      healthPostId: user?.healthPostId || '',
      referredHealthPostId: '',
      patientId: opd.patientId,
      opdId: opd.id,
      referralReason: '',
    },
  });
  const {
    handleSubmit,
    formState: { dirtyFields },
    reset,
  } = form;

  const { mutateReferal, isPending } = useOpdReferalMutation({
    onSuccess: () => {
      toast.success(t('referSuccess'));
      form.reset();
      handleExit();
    },
  });

  const onSubmit = (data: TReferalSchema) => {
    mutateReferal({
      data,
    });
  };

  const {
    data: healthpostsOptions,
    isSuccess: isHealthPostOptionsSuccess,
    ...rest
  } = useQuery({
    queryKey: queryKeys.healthPost.healthPosts,
    queryFn: async () => fetchHealthPostInfo({}),
    select: (data) =>
      (data?.data as THealthPost[])
        .map((hp) => ({
          label: hp.name,
          value: hp.id,
        }))
        .filter((hp) => hp.value !== user?.healthPostId),
    enabled: isOpen,
  });
  const selectedHp = form.watch('referredHealthPostId');
  return (
    <FormDialog
      isOpen={isOpen}
      toggleModal={handleExit}
      title={t('referPatient', {
        name: renderFullName({
          params: opd.patient,
        }),
        healthPost: selectedHp
          ? healthpostsOptions?.find((hp) => hp.value === selectedHp)?.label ||
            ''
          : '',
      })}
      className="sm:max-w-lg md:max-w-fit"
      isFormDirty={Object.keys(dirtyFields).length > 0}
      mutateAction={{
        label: t('refer', {
          name: renderFullName({
            params: opd.patient,
          }),
          healthPost: selectedHp
            ? healthpostsOptions?.find((hp) => hp.value === selectedHp)
                ?.label || ''
            : '',
        }),
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex w-full min-w-2xl flex-col gap-4 px-2">
            <FormField
              control={form.control}
              name="referredHealthPostId"
              render={({ field }) => (
                <FormWrapper label={t2('SidebarItems.healthpost')} isRequired>
                  <FormSelect
                    className="w-full"
                    options={
                      (isHealthPostOptionsSuccess && healthpostsOptions) || []
                    }
                    required
                    placeholder={tPlaceholder('selectHealthPost')}
                    {...field}
                    variant="searchable"
                    error={!!form.formState.errors.referredHealthPostId}
                  />
                </FormWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="referralReason"
              render={({ field }) => (
                <FormWrapper
                  label={tPlaceholder('reasonsForReferral')}
                  isRequired
                >
                  <Textarea
                    {...field}
                    placeholder={tPlaceholder('reasonsForReferral')}
                    className="min-h-40 p-4"
                  />
                </FormWrapper>
              )}
            />
          </div>
        </form>
      </Form>
    </FormDialog>
  );
};
