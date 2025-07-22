'use client';

import { fetchClientsInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { FormSelect } from '@/components/reusables/form-select';
import FormWrapper from '@/components/reusables/form-wrapper';
import { Form, FormField } from '@/components/ui/form';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { mapEnumToOptions, renderFullName } from '@/lib/utils';
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
} from '@/constants/medicine.constant';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormButtons } from '@/components/reusables/form-dialog';
import { useEffect } from 'react';

export default function OpdRegistrationForm() {
  const t = useTypedTranslations('Validation');
  const tPlace = useTypedTranslations('Placeholder');
  const tOpd = useTypedTranslations('OpdSection');
  const tEnumKeys = useTypedTranslations('Enums');

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
      prescribtions: [],
      healthPostId: healthPostInfo?.id || '',
      complaints: '',
      diagnosis: '',
      observedExamination: '',
      treatment: '',
      medicines: [],
      examinier: user?.id || '',
      followUpRequired: false,
      visitType: undefined,
      treatementType: undefined,
    },
    // values:{

    // }
    resolver: zodResolver(OpdSchema),

    mode: 'onSubmit',
  });

  const { handleSubmit, setValue } = form;
  const selectedMedicinesList = form.watch('medicines') || [];
  console.log('errors', form.getValues());
  const onSubmit = (data: TOpdSchema) => {
    console.log('Form submitted with data:', data);
    // Handle form submission logic here
  };

  const { data: patientOptions, isSuccess: isPatientSuccess } = useQuery({
    queryKey: queryKeys.client.clients,
    queryFn: async () =>
      fetchClientsInfo({
        healthPostId: healthPostInfo?.id || '',
      }),
    select: (data) =>
      (data?.data as TClient[]).map((client) => ({
        label: renderFullName({
          params: client,
        }),
        value: client.id,
      })),
    enabled: !!healthPostInfo?.id,
  });

  useEffect(() => {
    selectedMedicinesList.forEach((medicine, idx) => {
      setValue(`prescribtions.${idx}.name`, medicine?.label || '');
      setValue(`prescribtions.${idx}.id`, medicine.id || '');
      const [
        dose = '',
        frequency = '',
        timing = 'ANY_TIME',
        intakeRoute = '',
        unit = '',
      ] = medicine.id?.split('||') || [];
      setValue(`prescribtions.${idx}.dosage`, dose);
      setValue(`prescribtions.${idx}.frequency`, frequency);
      setValue(
        `prescribtions.${idx}.timing`,
        (timing || 'ANY_TIME') as 'BEFORE_FOOD' | 'AFTER_FOOD' | 'ANY_TIME',
      );
      setValue(`prescribtions.${idx}.intakeRoute`, intakeRoute);
      setValue(`prescribtions.${idx}.quantity`, unit);
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
                    options={(isPatientSuccess && patientOptions) || []}
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
                <FormWrapper label={tOpd('visitType')} isRequired>
                  <FormSelect
                    options={mapEnumToOptions(
                      TreatementType,
                      tEnumKeys,
                      'treatmentType',
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
                      className="flex-1"
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
                      className="flex-1"
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
                      className="flex-1"
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
                      className="flex-1"
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
                      className="flex-1"
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
                      className="flex-1"
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
                      className="flex-1"
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
                      <BlockEditor
                        placeholder={tPlace('complaintsHistory')}
                        outerClassName="h-96"
                        {...field}
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
                      <BlockEditor
                        placeholder={tPlace('observedExamination')}
                        outerClassName="h-96"
                        {...field}
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
                      name={`prescribtions.${idx}.dosage`}
                      render={({ field, formState }) => (
                        <FormWrapper label={tOpd('dosage')} isRequired>
                          <Input
                            {...field}
                            placeholder={tOpd('dosage')}
                            className="flex-1"
                            errors={
                              formState.errors.prescribtions?.[idx]?.dosage
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // How long the medicine should be taken (e.g., "5 days") */}
                    <FormField
                      control={form.control}
                      name={`prescribtions.${idx}.duration`}
                      render={({ field, formState }) => (
                        <FormWrapper label={tOpd('duration')} isRequired>
                          <Input
                            {...field}
                            placeholder={tOpd('duration')}
                            className="flex-1"
                            type="number"
                            errors={
                              formState.errors.prescribtions?.[idx]?.duration
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // How often to take it (e.g., "3 times a day") */}
                    <FormField
                      control={form.control}
                      name={`prescribtions.${idx}.frequency`}
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
                              !!form.formState.errors.prescribtions?.[idx]
                                ?.frequency
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // Morning night or day */}
                    <FormField
                      control={form.control}
                      name={`prescribtions.${idx}.intakeTime`}
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
                      name={`prescribtions.${idx}.quantity`}
                      render={({ field, formState }) => (
                        <FormWrapper label={tOpd('quantity')} isRequired>
                          <Input
                            {...field}
                            placeholder={tOpd('quantity')}
                            className="flex-1"
                            errors={
                              formState.errors.prescribtions?.[idx]?.quantity
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    {/* // Route of administration (e.g., "oral", "injection", "topical") */}
                    <FormField
                      control={form.control}
                      name={`prescribtions.${idx}.intakeRoute`}
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
                              !!form.formState.errors.prescribtions?.[idx]
                                ?.intakeRoute
                            }
                          />
                        </FormWrapper>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`prescribtions.${idx}.timing`}
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
              // isLoading: isPending,
              onClick: handleSubmit(onSubmit),
              disabled: !Object.keys(form.formState.dirtyFields).length,
              className: 'rounded-sm',
            }}
          />
        </form>
      </Form>
    </div>
  );
}
