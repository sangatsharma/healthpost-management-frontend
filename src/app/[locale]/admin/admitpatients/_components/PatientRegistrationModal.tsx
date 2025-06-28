'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { patientSchema, PatientFormData } from '@/schemas/patient.schema';
import { TPatient } from '@/types/patient.types';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
  initialData?: TPatient | null;
  isEditing?: boolean;
}

export function PatientRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: PatientRegistrationModalProps) {
  const t = useTranslations('GeneralPages.Patient');

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: 'male',
      bloodGroup: 'unknown',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      medicalHistory: '',
      allergies: '',
      currentMedications: '',
    },
  });

  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email || '',
        phone: initialData.phone,
        address: initialData.address,
        dateOfBirth: initialData.dateOfBirth,
        gender: initialData.gender,
        bloodGroup: initialData.bloodGroup,
        emergencyContactName: initialData.emergencyContactName,
        emergencyContactPhone: initialData.emergencyContactPhone,
        emergencyContactRelation: initialData.emergencyContactRelation,
        medicalHistory: initialData.medicalHistory || '',
        allergies: initialData.allergies || '',
        currentMedications: initialData.currentMedications || '',
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: 'unknown',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        medicalHistory: '',
        allergies: '',
        currentMedications: '',
      });
    }
  }, [initialData, isEditing, form]);

  const handleSubmit = (data: PatientFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editPatient') : t('addPatient')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update patient information and medical details.'
              : 'Fill in the patient information to register a new patient.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-semibold">
                  {t('personalInformation')}
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('firstName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('lastName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dateOfBirth')}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('gender')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">{t('male')}</SelectItem>
                            <SelectItem value="female">
                              {t('female')}
                            </SelectItem>
                            <SelectItem value="other">{t('other')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('bloodGroup')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">{t('aPositive')}</SelectItem>
                            <SelectItem value="A-">{t('aNegative')}</SelectItem>
                            <SelectItem value="B+">{t('bPositive')}</SelectItem>
                            <SelectItem value="B-">{t('bNegative')}</SelectItem>
                            <SelectItem value="AB+">
                              {t('abPositive')}
                            </SelectItem>
                            <SelectItem value="AB-">
                              {t('abNegative')}
                            </SelectItem>
                            <SelectItem value="O+">{t('oPositive')}</SelectItem>
                            <SelectItem value="O-">{t('oNegative')}</SelectItem>
                            <SelectItem value="unknown">
                              {t('unknown')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-semibold">
                  {t('contactInformation')}
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phone')}</FormLabel>
                        <FormControl>
                          <Input placeholder="+977-9841234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')} (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="patient@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter full address"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-semibold">
                  {t('emergencyContact')}
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('emergencyContactName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact person name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('emergencyContactPhone')}</FormLabel>
                        <FormControl>
                          <Input placeholder="+977-9841234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContactRelation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('emergencyContactRelation')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Spouse, Parent, Sibling"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-semibold">
                  {t('medicalInformation')}
                </h3>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('medicalHistory')} (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Previous illnesses, surgeries, chronic conditions..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('allergies')} (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Food allergies, drug allergies, environmental allergies..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentMedications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('currentMedications')} (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Currently taking medications, dosage, frequency..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
