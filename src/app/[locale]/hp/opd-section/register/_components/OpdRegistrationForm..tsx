'use client';

import { fetchClientsInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { Form, FormField } from '@/components/ui/form';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import {
  getRequestingParty,
  mapEnumToOptions,
  renderFullName,
} from '@/lib/utils';
import {
  getOpdSchema,
  TOpdSchema,
} from '@/schemas/healthpostPortal/opd.schema';
import { TClient } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { useForm } from 'react-hook-form';
import { formatDate } from 'date-fns';
import { ADToBS } from 'bikram-sambat-js';
import { TreatementType, VisitType } from '@/constants/healthpost.constant';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import BlockEditor from '@/components/block-editor';
import { Input } from '@/components/ui/input';
import { SelectMultiple } from '@/components/reusables/SelectMultiple';
import {
  Frequency,
  IntakeRoute,
  IntakeTime,
  MEDICINE_LIST,
  Timing,
} from '@/constants/medicine.constant';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormButtons } from '@/components/reusables/form-dialog';
import { useEffect, useMemo } from 'react';
import { useOpdMutation } from '@/api/mutation';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { idbPersister } from '@/lib/idbPersister';
import { queryClient } from '@/lib/queryClient';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OpdRegistrationForm() {
  const searchParams = useSearchParams();
  const opdId = searchParams.get('opdId');
  const router = useRouter();
  const t = useTypedTranslations('Validation');
  const tPlace = useTypedTranslations('Placeholder');
  const tOpd = useTypedTranslations('OpdSection');
  const tEnumKeys = useTypedTranslations('Enums');
  const tToast = useTypedTranslations('Toast');

  const OpdSchema = getOpdSchema(t);
  const { healthPostInfo, user } = useUserStore();
  const today = new Date();
  const form = useForm<TOpdSchema>({
    defaultValues: {
      visitedDate: ADToBS(
        formatDate(
          new Date(
            today.getFullYear(),
            today.getMonth() + 0,
            today.getDate() - 1,
          ),
          'yyyy-MM-dd',
        ),
      ),
      patientId: '',
      vitals: {
        bp: '',
        pulse: '',
        temperature: '',
        respiration: '',
        weight: '',
        height: '',
        mucus: '',
      },
      prescriptions: [],
      healthPostId: healthPostInfo?.id || '',
      complaints: '',
      diagnosis: '',
      observedExamination: '',
      treatment: '',
      medicines: [],
      examinerId: user?.id || '',
      followUpRequired: false,
      visitType: undefined,
      treatementType: undefined,
    },
    // values:{

    // }
    resolver: zodResolver(OpdSchema),

    mode: 'onSubmit',
  });

  const { mutateOpd, isPending } = useOpdMutation({
    onSuccess: async () => {
      toast.success(tToast('opdCreated'));
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['offline-opd-mutations'],
      });
      if (opdId) {
        await idbPersister.removeOfflineMutation(opdId);
      }
      router.back();
    },
  });

  const { handleSubmit, setValue } = form;

  const watchedMedicines = form.watch('medicines');
  const selectedMedicinesList = useMemo(
    () => watchedMedicines || [],
    [watchedMedicines],
  );

  const onSubmit = (data: TOpdSchema) => {
    const { medicines, healthPostId: _, ...rest } = data;
    mutateOpd({
      method: 'POST',
      data: {
        ...rest,
        medicines: medicines?.map((medicine) => medicine.label) || [],
        healthPostId: healthPostInfo?.id || '',
        ...(!navigator.onLine && {
          name: [...(patientOptions ?? []), ...(offlineData ?? [])].find(
            (option) => option.value === data.patientId,
          )?.label,
        }),
      },
    });
  };

  const { data: patientOptions, isSuccess: isPatientSuccess } = useQuery({
    queryKey: [queryKeys.client.clients, 'all', 'all'],
    queryFn: async () =>
      fetchClientsInfo({
        healthPostId: undefined,
      }),
    select: (data) =>
      (data?.data as TClient[]).map((client) => ({
        label: renderFullName({
          params: client,
        }),
        value: client.id ?? '',
      })),
  });

  const { data: offlineData, isSuccess: offlineSuccess } = useQuery({
    queryKey: ['offline-clients-mutations'],
    queryFn: () => idbPersister.getAllOfflineMutations<TClient>(),
    select: (data) => {
      return data
        .filter((d) => getRequestingParty(d.key) === 'CLIENTS')
        .map((client) => ({
          label: renderFullName({
            params: client.data,
          }),
          value: client.data.email || '',
        }));
    },
    enabled: !navigator.onLine,
  });

  useEffect(() => {
    async function fetchOpdData() {
      if (opdId) {
        const allOpdData =
          await idbPersister.getAllOfflineMutations<TOpdSchema>();
        const opdData = allOpdData.find((data) => data.key === opdId);
        console.log('opdData', opdData);
        if (opdData) {
          form.reset({
            ...opdData.data,
            medicines: opdData?.data?.prescriptions?.map((d) => {
              const [id, label] = [d.id, d.name];
              return { id, label };
            }),
          });
        }
      }
    }
    fetchOpdData();
  }, [opdId, form]);

  useEffect(() => {
    selectedMedicinesList.forEach((medicine, idx) => {
      setValue(`prescriptions.${idx}.name`, medicine?.label || '');
      setValue(`prescriptions.${idx}.id`, medicine.id || '');
      const [
        dose = '',
        frequency = Frequency.OD,
        timing = Timing.ANY_TIME,
        intakeRoute = IntakeRoute.PO,
        unit = '',
      ] = medicine.id?.split('||') || [];
      setValue(`prescriptions.${idx}.dosage`, dose);
      setValue(`prescriptions.${idx}.frequency`, frequency as Frequency);
      setValue(
        `prescriptions.${idx}.timing`,
        (timing || Timing.ANY_TIME) as Timing,
      );
      setValue(`prescriptions.${idx}.intakeRoute`, intakeRoute as IntakeRoute);
      setValue(`prescriptions.${idx}.quantity`, unit);
    });
  }, [selectedMedicinesList, setValue]);

  return (
    <div className="mx-auto mb-20 flex w-full flex-col space-y-4 p-4 px-12">
      <DataTableToolbar
        header={{
          label: tOpd('newOpdReg'),
        }}
        backNavigationUrl="/hp/opd-section"
        allowSearch={false}
      />
      <div>
        <h2 className="text-lg font-semibold">{tOpd('formTitle')}</h2>
        <p className="text-muted-foreground border-b-2 pb-2 text-sm">
          {tOpd('formSubtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormWrapper label={tOpd('patientName')} isRequired>
                  <FormSelect
                    options={[
                      ...(isPatientSuccess ? patientOptions : []),
                      ...(offlineSuccess ? (offlineData ?? []) : []),
                    ]}
                    placeholder={tPlace('selectPatient')}
                    {...field}
                    variant="searchable"
                    error={!!form.formState.errors.patientId}
                    className="w-full"
                    popoverClassName="!w-full !max-w-full"
                  />
                </FormWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="visitType"
              render={({ field }) => (
                <FormWrapper label={tOpd('visitType')} isRequired>
                  <FormSelect
                    options={mapEnumToOptions(
                      VisitType,
                      tEnumKeys,
                      'visitType',
                    )}
                    placeholder={tPlace('selectVisitType')}
                    {...field}
                    variant="basic"
                    error={!!form.formState.errors.visitType}
                  />
                </FormWrapper>
              )}
            />
            <FormField
              control={form.control}
              name="treatementType"
              render={({ field }) => (
                <FormWrapper label={tOpd('treatmentType')} isRequired>
                  <FormSelect
                    options={mapEnumToOptions(
                      TreatementType,
                      tEnumKeys,
                      'treatmentType',
                    )}
                    placeholder={tPlace('selectTreatmentType')}
                    {...field}
                    variant="basic"
                    error={!!form.formState.errors.treatementType}
                  />
                </FormWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="visitedDate"
              render={({ field }) => (
                <FormWrapper label={tOpd('visitedDate')} isRequired>
                  <NepaliDatePicker
                    inputClassName="w-full h-10 px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-background border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 focus-visible:ring-[3px] outline-none"
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
            <div className="col-span-4 grid w-full grid-cols-7 gap-4 pt-2">
              <FormField
                control={form.control}
                name="vitals.bp"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('bp') + ' (mmHg)'}>
                    <Input
                      {...field}
                      placeholder={tOpd('bp')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.bp}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.pulse"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('pulse') + ' (bpm)'}>
                    <Input
                      {...field}
                      placeholder={tOpd('pulse')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.pulse}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.temperature"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('temperature') + ' (°F)'}>
                    <Input
                      {...field}
                      placeholder={tOpd('temperature')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.temperature}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.respiration"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('respiration') + ' (breaths/min)'}>
                    <Input
                      {...field}
                      placeholder={tOpd('respiration')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.respiration}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.height"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('height') + ' (cm)'}>
                    <Input
                      {...field}
                      placeholder={tOpd('height')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.height}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.weight"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('weight') + ' (kg)'}>
                    <Input
                      {...field}
                      placeholder={tOpd('weight')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.weight}
                    />
                  </FormWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.mucus"
                render={({ field, formState }) => (
                  <FormWrapper label={tOpd('mucus')}>
                    <Input
                      {...field}
                      placeholder={tOpd('mucus')}
                      className="!w-full flex-1"
                      errors={formState.errors.vitals?.mucus}
                    />
                  </FormWrapper>
                )}
              />
            </div>
            <div className="col-span-4 flex w-full gap-4">
              <div className="w-1/2 flex-1">
                <FormField
                  control={form.control}
                  name="complaints"
                  render={({ field }) => (
                    <FormWrapper label={tOpd('complaintsHistory')} isRequired>
                      {/* <BlockEditor
                        placeholder={tPlace('complaintsHistory')}
                        outerClassName="h-96"
                        {...field}
                      /> */}
                      <Textarea
                        {...field}
                        placeholder={tPlace('complaintsHistory')}
                        className="min-h-40 p-4"
                      />
                    </FormWrapper>
                  )}
                />
              </div>
              <div className="w-1/2 flex-1">
                <FormField
                  control={form.control}
                  name="observedExamination"
                  render={({ field }) => (
                    <FormWrapper label={tOpd('observedExamination')} isRequired>
                      {/* <BlockEditor
                        placeholder={tPlace('observedExamination')}
                        outerClassName="h-96"
                        {...field}
                      /> */}
                      <Textarea
                        {...field}
                        placeholder={tPlace('observedExamination')}
                        className="min-h-40 p-4"
                      />
                    </FormWrapper>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="medicines"
              render={({ field }) => (
                <FormWrapper label={tOpd('medicines')} className="col-span-4">
                  <SelectMultiple
                    className="w-1/2 max-w-full"
                    options={MEDICINE_LIST.map((medicine) => ({
                      value: medicine.medicineId,
                      label:
                        medicine.medicineName +
                        ' ' +
                        (medicine.strength || '') +
                        ' ' +
                        (medicine.medicineForm.toLowerCase() || ''),
                      id:
                        (medicine.dose || '') +
                        '||' +
                        (medicine.frequency || '') +
                        '||' +
                        (medicine.medicineTime || '') +
                        '||' +
                        (medicine.route || '') +
                        '||' +
                        ('1 ' + medicine.unit || ''),
                    }))}
                    value={field.value?.map((item) => item?.value || '') || []}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    popoverClassName="w-full max-w-full"
                    maxCount={8}
                    // maxSelection={8}
                    placeholder={tPlace('selectMedicines')}
                  />
                </FormWrapper>
              )}
            />
            {selectedMedicinesList.length > 0 && (
              <div className="col-span-4 w-full space-y-4">
                {selectedMedicinesList.map((medicine, idx) => (
                  <fieldset
                    className="grid grid-cols-4 gap-4 space-y-2 rounded-sm border-2 border-gray-400 p-2"
                    key={medicine.value}
                  >
                    <legend className="col-span-4 ml-8 text-lg font-semibold">
                      {medicine.label || medicine.value}
                    </legend>
                    {/* // quantity per intake */}
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.dosage`}
                      render={({ field, formState }) => (
                        <FormWrapper label={tOpd('dosage')} isRequired>
                          <Input
                            {...field}
                            placeholder={tOpd('dosage')}
                            className="flex-1"
                            errors={
                              formState.errors.prescriptions?.[idx]?.dosage
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // How long the medicine should be taken (e.g., "5 days") */}
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.duration`}
                      render={({ field, formState }) => (
                        <FormWrapper label={tOpd('duration')} isRequired>
                          <Input
                            {...field}
                            placeholder={tOpd('duration')}
                            className="flex-1"
                            type="number"
                            errors={
                              formState.errors.prescriptions?.[idx]?.duration
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // How often to take it (e.g., "3 times a day") */}
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.frequency`}
                      render={({ field }) => (
                        <FormWrapper label={tOpd('frequency')} isRequired>
                          <FormSelect
                            options={mapEnumToOptions(
                              Frequency,
                              tEnumKeys,
                              'frequency',
                            )}
                            placeholder={tOpd('frequency')}
                            {...field}
                            variant="basic"
                            error={
                              !!form.formState.errors.prescriptions?.[idx]
                                ?.frequency
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // Morning night or day */}
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.intakeTime`}
                      render={({ field }) => (
                        <FormWrapper label={tOpd('intakeTime')} isRequired>
                          <SelectMultiple
                            className="max-w-full"
                            options={mapEnumToOptions(
                              IntakeTime,
                              tEnumKeys,
                              'intakeTime',
                            )}
                            {...field}
                            value={field.value?.split(',') || []}
                            onValueChange={(items) => {
                              if (items.length === 0) {
                                field.onChange(undefined);
                                return;
                              }
                              const combined = items
                                .map((item) => item.value)
                                .join(', ');
                              field.onChange(combined);
                            }}
                            popoverClassName="w-full max-w-full !h-fit"
                            maxCount={4}
                            placeholder={tOpd('intakeTime')}
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // Quantity (e.g., "1 tablet") */}
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.quantity`}
                      render={({ field, formState }) => (
                        <FormWrapper label={tOpd('quantity')} isRequired>
                          <Input
                            {...field}
                            placeholder={tOpd('quantity')}
                            className="flex-1"
                            errors={
                              formState.errors.prescriptions?.[idx]?.quantity
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // Route of administration (e.g., "oral", "injection", "topical") */}
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.intakeRoute`}
                      render={({ field }) => (
                        <FormWrapper label={tOpd('intakeRoute')} isRequired>
                          <FormSelect
                            options={mapEnumToOptions(
                              IntakeRoute,
                              tEnumKeys,
                              'intakeRoute',
                            )}
                            placeholder={tOpd('intakeRoute')}
                            {...field}
                            variant="basic"
                            error={
                              !!form.formState.errors.prescriptions?.[idx]
                                ?.intakeRoute
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`prescriptions.${idx}.timing`}
                      render={({ field }) => (
                        <FormWrapper
                          label={tOpd('timing')}
                          isRequired
                          className="col-span-2 flex flex-col items-start justify-center"
                        >
                          <RadioGroup
                            defaultValue="ANY_TIME"
                            className="relative flex items-center gap-6"
                            value={field.value || 'anytime'}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="BEFORE_FOOD"
                                id={`before-meal.${idx}`}
                                className="border-green-500 text-green-500 [&_svg]:fill-green-500"
                              />
                              <Label
                                htmlFor={`before-meal.${idx}`}
                                className="text-md"
                              >
                                {tOpd('beforeMeal')}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={'AFTER_FOOD'}
                                id={`after-meal.${idx}`}
                                className="border-indigo-500 text-indigo-500 [&_svg]:fill-indigo-500"
                              />
                              <Label
                                htmlFor={`after-meal.${idx}`}
                                className="text-md"
                              >
                                {tOpd('afterMeal')}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="ANY_TIME"
                                id={`any-time.${idx}`}
                                className="border-rose-500 text-rose-500 [&_svg]:fill-rose-500"
                              />
                              <Label
                                htmlFor={`any-time.${idx}`}
                                className="text-md"
                              >
                                {tOpd('anyTime')}
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormWrapper>
                      )}
                    />
                  </fieldset>
                ))}
              </div>
            )}
            <div className="col-span-4 flex w-full gap-4">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormWrapper label={tOpd('diagnosis')} isRequired>
                      <BlockEditor
                        {...field}
                        placeholder={tPlace('diagnosis')}
                        outerClassName="h-96"
                      />
                    </FormWrapper>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormWrapper label={tOpd('treatment')} isRequired>
                      <BlockEditor
                        {...field}
                        placeholder={tPlace('treatment')}
                        outerClassName="h-96"
                      />
                    </FormWrapper>
                  )}
                />
              </div>
            </div>
            <div className="relative col-span-4 flex w-full items-center gap-4">
              <FormField
                control={form.control}
                name="followUpRequired"
                render={() => (
                  <FormWrapper
                    showSwitch={{
                      label: tOpd('followUpRequired'),
                      checked: form.watch('followUpRequired') ?? false,
                      onChange: (val: boolean) => {
                        form.setValue('followUpRequired', val, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        form.setValue(
                          'followUpDate',
                          ADToBS(
                            formatDate(
                              new Date(
                                today.getFullYear(),
                                today.getMonth() + 0,
                                today.getDate() - 1,
                              ),
                              'yyyy-MM-dd',
                            ),
                          ),
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                          },
                        );
                      },
                    }}
                    className="my-auto flex items-center gap-2"
                  />
                )}
              />

              {form.watch('followUpRequired') && (
                <FormField
                  control={form.control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormWrapper label={tOpd('followUpDate')} isRequired>
                      <NepaliDatePicker
                        inputClassName="w-full h-10 px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-background border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 focus-visible:ring-[3px] outline-none"
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
              )}
              <FormField
                control={form.control}
                name="isGenderViolence"
                render={() => (
                  <FormWrapper
                    showSwitch={{
                      label: tOpd('isGenderViolence'),
                      checked: form.watch('isGenderViolence') ?? false,
                      onChange: (val: boolean) =>
                        form.setValue('isGenderViolence', val, {
                          shouldDirty: true,
                          shouldTouch: true,
                        }),
                    }}
                    className="my-auto flex items-center gap-2"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="isPregnant"
                render={() => (
                  <FormWrapper
                    showSwitch={{
                      label: tOpd('isPregnant'),
                      checked: form.watch('isPregnant') ?? false,
                      onChange: (val: boolean) =>
                        form.setValue('isPregnant', val, {
                          shouldDirty: true,
                          shouldTouch: true,
                        }),
                    }}
                    className="my-auto flex items-center gap-2"
                  />
                )}
              />
            </div>
          </div>

          <FormButtons
            className="mt-8 flex justify-start gap-4"
            resetAction={{
              onClick: () => form.reset(),
            }}
            mutateAction={{
              isLoading: isPending,
              onClick: handleSubmit(onSubmit),
              className: 'rounded-sm',
            }}
          />
        </form>
      </Form>
    </div>
  );
}
