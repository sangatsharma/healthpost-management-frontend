'use client';

import { useTranslations } from 'next-intl';
import {
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  Heart,
  Pill,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TPatient } from '@/types/patient.types';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: TPatient | null;
  onEdit: (patient: TPatient) => void;
}

export function PatientDetailsModal({
  isOpen,
  onClose,
  patient,
  onEdit,
}: PatientDetailsModalProps) {
  const t = useTranslations('GeneralPages.Patient');

  if (!patient) return null;

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {patient.firstName} {patient.lastName}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {t('patientDetails')} - ID: {patient.id}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={patient.status === 'active' ? 'default' : 'secondary'}
                className={
                  patient.status === 'active'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
                    : ''
                }
              >
                {t(patient.status)}
              </Badge>
              <Button onClick={() => onEdit(patient)} size="sm">
                <Edit className="mr-2 h-4 w-4" />
                {t('edit')}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  {t('personalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('fullName')}
                    </div>
                    <div className="text-base font-semibold">
                      {patient.firstName} {patient.lastName}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      {t('dateOfBirth')}
                    </div>
                    <div className="text-base">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('age')}
                    </div>
                    <div className="text-base font-semibold">
                      {calculateAge(patient.dateOfBirth)} years
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('gender')}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {t(patient.gender)}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                      <Heart className="h-4 w-4" />
                      {t('bloodGroup')}
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {patient.bloodGroup}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('registrationDate')}
                    </div>
                    <div className="text-base">
                      {new Date(patient.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5" />
                  {t('contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                      <Phone className="h-4 w-4" />
                      {t('phone')}
                    </div>
                    <div className="font-mono text-base">{patient.phone}</div>
                  </div>

                  {patient.email && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                        <Mail className="h-4 w-4" />
                        {t('email')}
                      </div>
                      <div className="text-base">{patient.email}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    {t('address')}
                  </div>
                  <div className="text-base">{patient.address}</div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  {t('emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('emergencyContactName')}
                    </div>
                    <div className="text-base font-semibold">
                      {patient.emergencyContactName}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('emergencyContactPhone')}
                    </div>
                    <div className="font-mono text-base">
                      {patient.emergencyContactPhone}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('emergencyContactRelation')}
                    </div>
                    <Badge variant="outline">
                      {patient.emergencyContactRelation}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  {t('medicalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.medicalHistory && (
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm font-medium">
                      {t('medicalHistory')}
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-base">
                      {patient.medicalHistory}
                    </div>
                  </div>
                )}

                {patient.allergies && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {t('allergies')}
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-base dark:border-orange-800 dark:bg-orange-950/30">
                      {patient.allergies}
                    </div>
                  </div>
                )}

                {patient.currentMedications && (
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                      <Pill className="h-4 w-4" />
                      {t('currentMedications')}
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-base dark:border-blue-800 dark:bg-blue-950/30">
                      {patient.currentMedications}
                    </div>
                  </div>
                )}

                {!patient.medicalHistory &&
                  !patient.allergies &&
                  !patient.currentMedications && (
                    <div className="text-muted-foreground py-6 text-center">
                      No medical information available
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
