'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import {
  getClientFormSteps,
  getClientSchema,
  TClientSchema,
} from '@/schemas/healthpostPortal/clients.schema';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import PersonalInfoForm from './PersonalInfoForm';
import AddressInfoForm from './AddressInfoForm';
import FamilyInfoForm from './FamilyInfoForm';
import HealthAndBankingInfo from './HealthAndBankingInfo';
import FormDialog from '@/components/reusables/form-dialog';
import { TClient, UserRole, UserType } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { useClientMutation } from '@/api/mutation';
import { convertToFormData } from '@/lib/utils';
import { fetchClientsInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { idbPersister } from '@/lib/idbPersister';
import { queryClient } from '@/lib/queryClient';
import { BSToAD } from 'bikram-sambat-js';

export default function ClientRegistrationModal({
  isOpen,
  handleExit,
  clientId,
  defaultValues,
}: {
  defaultValues?: TClient & {
    key?: string;
  };
  isOpen: boolean;
  clientId?: string;
  handleExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = useTypedTranslations('Validation');
  const ct = useTypedTranslations('ClientRegistration');
  const tToast = useTypedTranslations('Toast');
  const clientSchema = getClientSchema(t);
  const steps = getClientFormSteps(ct);
  const user = useUserStore((state) => state.user);

  const { mutateClient, isPending } = useClientMutation({
    onSuccess: async () => {
      toast.success(tToast(clientId ? 'clientsUpdated' : 'clientsCreated'));
      setIsSubmitted(true);
      if (defaultValues) {
        await idbPersister.removeOfflineMutation(defaultValues?.key);
      }
      queryClient.invalidateQueries({
        queryKey: ['offline-clients-mutations'],
      });
    },
  });

  const { data, isLoading, isSuccess, isError, refetch } = useQuery({
    queryKey: queryKeys.client.singleClient(clientId || ''),
    queryFn: () =>
      fetchClientsInfo({
        clientId: clientId || '',
      }),
    enabled: !!clientId,
  });

  const singleData = data?.data as TClientSchema;
  const formValues = {
    firstName: singleData?.firstName || '',
    middleName: singleData?.middleName || '',
    lastName: singleData?.lastName || '',
    dobBs: singleData?.dobBs || '',
    dobAd: singleData?.dobAd || '',
    phoneNumber: singleData?.phoneNumber || '',
    citizenshipNumber: singleData?.citizenshipNumber || '',
    casteType: singleData?.casteType || undefined,
    districtId: singleData?.districtId || '',
    palityId: singleData?.palityId || '',
    wardNo: singleData?.wardNo || '',
    tole: singleData?.tole || '',
    tDistrictId: singleData?.tDistrictId || '',
    tPalityId: singleData?.tPalityId || '',
    tWardNo: singleData?.tWardNo || '',
    tTole: singleData?.tTole || '',
    fatherName: singleData?.fatherName || '',
    motherName: singleData?.motherName || '',
    bank: singleData?.bank || '',
    bankBranch: singleData?.bankBranch || '',
    bankAccountNumber: singleData?.bankAccountNumber || '',
    guardianName: singleData?.guardianName || '',
    spouseName: singleData?.spouseName || '',
    disabilityIdentityType: singleData?.disabilityIdentityType || undefined,
    disabilityType: singleData?.disabilityType || undefined,
    maritalStatus: singleData?.maritalStatus || undefined,
    email: singleData?.email || '',
    height: singleData?.height || '',
    isEligibleForSgc: singleData?.isEligibleForSgc || false,
    isVaccineCompleted: singleData?.isVaccineCompleted || false,
    isMinor: singleData?.isMinor || false,
    lockReport: singleData?.lockReport || false,
    profileImage: singleData?.profileImage || [],
    nationalId: singleData?.nationalId || '',
    nshiNumber: singleData?.nshiNumber || '',
    weight: singleData?.weight || '',
    status: singleData?.status || undefined,
    role: singleData?.role || UserRole.PATIENT,
    accountType: singleData?.accountType || UserType.PATIENT,
    gender: singleData?.gender || undefined,
    nationality: singleData?.nationality || undefined,
    bloodGroup: singleData?.bloodGroup || undefined,
    healthPostId: singleData?.healthPostId || user?.healthPostId || '',
    emergencyContact: singleData?.emergencyContact || '',
    familyHistory: singleData?.familyHistory || '',
  };

  const form = useForm<TClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dobBs: '२०५६-०४-०२',
      dobAd: '2002-01-01',
      phoneNumber: '',
      citizenshipNumber: '',
      casteType: undefined,
      districtId: '',
      palityId: '',
      wardNo: '',
      tole: '',
      tDistrictId: '',
      tPalityId: '',
      tWardNo: '',
      tTole: '',
      fatherName: '',
      motherName: '',
      guardianName: '',
      spouseName: '',
      maritalStatus: undefined,
      bloodGroup: undefined,
      height: '',
      disabilityType: undefined,
      disabilityIdentityType: undefined,
      role: UserRole.PATIENT,
      accountType: UserType.PATIENT,
      healthPostId: user?.healthPostId,
      nshiNumber: '',
      bank: '',
      bankBranch: '',
      bankAccountNumber: '',
      isEligibleForSgc: false,
      isVaccineCompleted: false,
      isMinor: false,
      lockReport: false,
      profileImage: [],
      email: '',
      emergencyContact: '',
      familyHistory: '',
    },
    values:
      clientId && !isLoading && isSuccess && singleData
        ? formValues
        : undefined,
    mode: 'onChange',
  });
  const { dirtyFields } = form.formState;

  const nextStep = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const currentStepFields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(currentStepFields);

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const onSubmit = (data: TClientSchema) => {
    mutateClient({
      method: clientId ? 'PUT' : 'POST',
      data: convertToFormData(
        {
          ...data,
          patientId: clientId || null,
          dobAd: BSToAD(data.dobBs),
        },
        ['profileImage'],
        clientId
          ? {
              patientId: clientId,
              ...dirtyFields,
            }
          : undefined,
      ),
      healthPostId: user?.healthPostId || '',
    });
  };

  const progress = (currentStep / steps.length) * 100;

  useEffect(() => {
    if (defaultValues) {
      const normalized = {
        ...defaultValues,
        phoneNumber: defaultValues.phoneNumber
          ? `+${defaultValues.phoneNumber}`
          : '',
        emergencyContact: defaultValues.emergencyContact
          ? `+${defaultValues.emergencyContact}`
          : '',
        healthPostId: user?.healthPostId,
        height: `${defaultValues.height}`,
        weight: `${defaultValues.weight}`,
        citizenshipNumber: `${defaultValues.citizenshipNumber}`,
        nationalId: `${defaultValues.nationalId}`,
        nshiNumber: `null`,
      };
      form.reset(normalized);
    }
  }, [JSON.stringify(defaultValues), form]);

  return (
    <FormDialog
      isOpen={isOpen}
      toggleModal={handleExit}
      className="sm:max-w-lg md:max-w-fit"
      isFormDirty={Object.keys(dirtyFields).length > 0 && !isSubmitted}
      refetch={refetch}
      isError={isError}
      isLoading={isLoading}
    >
      {isSubmitted ? (
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent>
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {ct('registrationComplete')}
                </h2>
                <p className="text-gray-600">{ct('registrationSuccess')}</p>
                <Button
                  onClick={() => {
                    form.reset();
                    setIsSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="mt-4"
                >
                  {ct('registerAnother')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto w-7xl px-2">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="mb-2 pt-1 text-3xl font-bold">{ct('title')}</h1>
            <p className="text-lg">{ct('subtitle')}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {ct('stepOf', { current: currentStep, total: steps.length })}
              </span>
              <span className="text-sm font-medium">
                {ct('percentComplete', { percent: Math.round(progress) })}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="mb-8 flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    } `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: 'h-5 w-5',
                })}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && <PersonalInfoForm />}

                  {/* Step 2: Address Information */}
                  {currentStep === 2 && <AddressInfoForm />}

                  {/* Step 3: Family Information */}
                  {currentStep === 3 && <FamilyInfoForm />}

                  {/* Step 4: Health & Banking */}
                  {currentStep === 4 && <HealthAndBankingInfo />}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {ct('previous')}
                    </Button>

                    {currentStep < steps.length ? (
                      <Button
                        type="button"
                        onClick={(e) => nextStep(e)}
                        className="flex items-center gap-2"
                      >
                        {ct('next')}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        isLoading={isPending}
                        // disabled={!form.formState.isValid}
                        className="flex items-center gap-2"
                      >
                        {ct('submitRegistration')}
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </FormDialog>
  );
}
