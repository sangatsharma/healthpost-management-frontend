'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PatientRegistrationModal,
  PatientDetailsModal,
  PatientDataTable,
} from './_components';
import { TPatient } from '@/types/patient.types';
import { PatientFormData } from '@/schemas/patient.schema';

// Mock data for demonstrations
const mockPatients: TPatient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+977-9841234567',
    address: 'Kathmandu, Ward 1, Thamel',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    bloodGroup: 'O+',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+977-9841234568',
    emergencyContactRelation: 'Spouse',
    medicalHistory: 'No significant medical history',
    allergies: 'Peanuts, Shellfish',
    currentMedications: 'None',
    registrationDate: '2024-01-15',
    status: 'active',
    age: 34,
  },
  {
    id: '2',
    firstName: 'Sita',
    lastName: 'Sharma',
    email: 'sita.sharma@email.com',
    phone: '+977-9851234567',
    address: 'Lalitpur, Ward 3, Patan',
    dateOfBirth: '1985-08-22',
    gender: 'female',
    bloodGroup: 'A+',
    emergencyContactName: 'Ram Sharma',
    emergencyContactPhone: '+977-9851234568',
    emergencyContactRelation: 'Husband',
    medicalHistory: 'Hypertension since 2020',
    allergies: 'None known',
    currentMedications: 'Amlodipine 5mg daily',
    registrationDate: '2024-02-10',
    status: 'active',
    age: 39,
  },
  {
    id: '3',
    firstName: 'Ram',
    lastName: 'Bahadur',
    phone: '+977-9861234567',
    address: 'Bhaktapur, Ward 7, Durbar Square',
    dateOfBirth: '1975-12-03',
    gender: 'male',
    bloodGroup: 'B+',
    emergencyContactName: 'Gita Bahadur',
    emergencyContactPhone: '+977-9861234568',
    emergencyContactRelation: 'Wife',
    medicalHistory: 'Diabetes Type 2, diagnosed 2018',
    allergies: 'Aspirin',
    currentMedications: 'Metformin 500mg twice daily',
    registrationDate: '2024-01-20',
    status: 'inactive',
    age: 49,
  },
];

export default function AdmitPatientsPage() {
  const t = useTranslations('GeneralPages.Patient');
  const [patients, setPatients] = useState<TPatient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<TPatient | null>(null);
  const [editingPatient, setEditingPatient] = useState<TPatient | null>(null);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleAddPatient = (patientData: PatientFormData) => {
    const newPatient: TPatient = {
      ...patientData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
      age: calculateAge(patientData.dateOfBirth),
    };
    setPatients([...patients, newPatient]);
    setIsRegistrationModalOpen(false);
  };
  const handleEditPatient = (patientData: PatientFormData) => {
    if (editingPatient) {
      const updatedPatient: TPatient = {
        ...editingPatient,
        ...patientData,
        age: calculateAge(patientData.dateOfBirth),
      };
      setPatients(
        patients.map((p) => (p.id === editingPatient.id ? updatedPatient : p)),
      );
      setEditingPatient(null);
      setIsRegistrationModalOpen(false);
    }
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId));
  };

  const handleViewPatient = (patient: TPatient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (patient: TPatient) => {
    setEditingPatient(patient);
    setIsRegistrationModalOpen(true);
  };

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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            {t('patientRegistry')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage patient registrations and medical records
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPatient(null);
            setIsRegistrationModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('addPatient')}
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="search patients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="text-primary text-2xl font-bold">
              {patients.length}
            </div>
            <p className="text-muted-foreground text-sm">Total Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter((p) => p.status === 'active').length}
            </div>
            <p className="text-muted-foreground text-sm">Active Patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Patient Records</span>
            <Badge variant="secondary">
              {filteredPatients.length} of {patients.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PatientDataTable
            patients={filteredPatients}
            onView={handleViewPatient}
            onEdit={handleEditClick}
            onDelete={handleDeletePatient}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <PatientRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={editingPatient ? handleEditPatient : handleAddPatient}
        initialData={editingPatient}
        isEditing={!!editingPatient}
      />

      <PatientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onEdit={(patient: TPatient) => {
          setIsDetailsModalOpen(false);
          handleEditClick(patient);
        }}
      />
    </div>
  );
}
