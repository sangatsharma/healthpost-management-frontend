'use client';

import React from 'react';

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
import { UserRole, UserType } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { useClientMutation } from '@/api/mutation';
import { convertToFormData } from '@/lib/utils';

export default function ClientRegistrationModal({
  isOpen,
  handleExit,
}: {
  isOpen: boolean;
  handleExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = useTypedTranslations('Validation');
  const ct = useTypedTranslations('ClientRegistration');
  const clientSchema = getClientSchema(t);
  const steps = getClientFormSteps();
  const user = useUserStore((state) => state.user);

  const { mutateClient, isPending } = useClientMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      handleExit();
    },
  });

  const form = useForm<TClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dobBs: '',
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
    },
    mode: 'onChange',
  });
  const { dirtyFields } = form.formState;

  const nextStep = async () => {
    const currentStepFields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(currentStepFields);

    if ((isValid && currentStep < steps.length) || 1) {
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
      method: 'POST',
      data: convertToFormData(data, ['profileImage']),
      healthPostId: user?.healthPostId || '',
    });
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <FormDialog
      isOpen={isOpen}
      toggleModal={handleExit}
      className="sm:max-w-lg md:max-w-fit"
      isFormDirty={Object.keys(dirtyFields).length > 0 && !isSubmitted}
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
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    form.reset();
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
            <h1 className="mb-2 text-3xl font-bold">{ct('title')}</h1>
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
                        onClick={nextStep}
                        className="flex items-center gap-2"
                      >
                        {ct('next')}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        isLoading={isPending}
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
