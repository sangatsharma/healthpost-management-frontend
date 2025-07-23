'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Pill,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Bell,
  RefreshCw,
} from 'lucide-react';

export default function MedicationsPage() {
  const [selectedTab, setSelectedTab] = useState('current');

  // Mock medication data
  const medications = {
    current: [
      {
        id: 1,
        name: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        dosage: '5mg',
        frequency: 'Once daily',
        timing: ['08:00'],
        duration: '30 days',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        instructions: 'Take with or without food',
        prescribedBy: 'Dr. Sharma',
        condition: 'High Blood Pressure',
        compliance: 85,
        totalDoses: 30,
        takenDoses: 25,
        missedDoses: 5,
        nextRefill: '2024-01-25',
        status: 'active',
      },
      {
        id: 2,
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        dosage: '500mg',
        frequency: 'Twice daily',
        timing: ['08:00', '20:00'],
        duration: '90 days',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        instructions: 'Take with meals to reduce stomach upset',
        prescribedBy: 'Dr. Patel',
        condition: 'Diabetes',
        compliance: 92,
        totalDoses: 60,
        takenDoses: 55,
        missedDoses: 5,
        nextRefill: '2024-02-15',
        status: 'active',
      },
      {
        id: 3,
        name: 'Iron + Folic Acid',
        genericName: 'Ferrous Sulfate + Folic Acid',
        dosage: '100mg + 0.5mg',
        frequency: 'Once daily',
        timing: ['08:00'],
        duration: '90 days',
        startDate: '2023-12-01',
        endDate: '2024-02-29',
        instructions: 'Take on empty stomach with vitamin C',
        prescribedBy: 'Dr. Thapa',
        condition: 'Pregnancy Anemia',
        compliance: 78,
        totalDoses: 90,
        takenDoses: 70,
        missedDoses: 20,
        nextRefill: '2024-01-30',
        status: 'active',
      },
    ],
    past: [
      {
        id: 4,
        name: 'Amoxicillin',
        genericName: 'Amoxicillin Trihydrate',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        startDate: '2023-12-01',
        endDate: '2023-12-07',
        prescribedBy: 'Dr. Rai',
        condition: 'Respiratory Infection',
        compliance: 100,
        status: 'completed',
      },
      {
        id: 5,
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'As needed',
        duration: '5 days',
        startDate: '2023-11-15',
        endDate: '2023-11-20',
        prescribedBy: 'Dr. Sharma',
        condition: 'Fever',
        compliance: 80,
        status: 'completed',
      },
    ],
  };

  // Mock DOT treatment data
  const dotTreatments = [
    {
      id: 1,
      name: 'Iron Supplementation',
      type: 'DOT',
      startDate: '2024-01-01',
      duration: '90 days',
      dosesCompleted: 45,
      totalDoses: 90,
      compliance: 50,
      supervisor: 'Health Assistant Maya',
      status: 'active',
      nextVisit: '2024-01-25',
    },
    {
      id: 2,
      name: 'Calcium Supplementation',
      type: 'DOT',
      startDate: '2024-01-01',
      duration: '60 days',
      dosesCompleted: 55,
      totalDoses: 60,
      compliance: 92,
      supervisor: 'FCHV Sita',
      status: 'active',
      nextVisit: '2024-01-22',
    },
  ];

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'discontinued':
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl font-bold">My Medications</h1>
        <p className="text-muted-foreground">
          Track your medications and treatment compliance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Pill className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <div className="text-2xl font-bold">
              {medications.current.length}
            </div>
            <div className="text-sm text-gray-600">Active Medications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <div className="text-2xl font-bold">
              {Math.round(
                medications.current.reduce(
                  (acc, med) => acc + med.compliance,
                  0,
                ) / medications.current.length,
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Avg Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-orange-600" />
            <div className="text-2xl font-bold">
              {
                medications.current.filter(
                  (med) =>
                    new Date(med.nextRefill) <=
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Refills Due</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-600" />
            <div className="text-2xl font-bold">
              {medications.current.reduce(
                (acc, med) => acc + med.missedDoses,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600">Missed Doses</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Medications</TabsTrigger>
          <TabsTrigger value="dot">DOT Treatment</TabsTrigger>
          <TabsTrigger value="past">Past Medications</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {medications.current.map((medication) => (
            <Card key={medication.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {medication.genericName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(medication.status)}
                    <Badge variant="outline">{medication.condition}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Medication Details */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Dosage
                    </h4>
                    <p className="font-medium">{medication.dosage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Frequency
                    </h4>
                    <p className="font-medium">{medication.frequency}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Timing
                    </h4>
                    <p className="font-medium">
                      {medication.timing.join(', ')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Prescribed By
                    </h4>
                    <p className="font-medium">{medication.prescribedBy}</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="rounded-lg bg-blue-50 p-3">
                  <h4 className="mb-1 text-sm font-semibold text-blue-800">
                    Instructions
                  </h4>
                  <p className="text-sm text-blue-700">
                    {medication.instructions}
                  </p>
                </div>

                {/* Compliance Progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      Compliance Progress
                    </h4>
                    <span
                      className={`font-bold ${getComplianceColor(medication.compliance)}`}
                    >
                      {medication.compliance}%
                    </span>
                  </div>
                  <Progress
                    value={medication.compliance}
                    className="mb-2 h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Taken: {medication.takenDoses}/{medication.totalDoses}
                    </span>
                    <span>Missed: {medication.missedDoses}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Taken
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Reminder
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Request Refill
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Schedule
                  </Button>
                </div>

                {/* Refill Alert */}
                {new Date(medication.nextRefill) <=
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                  <div className="rounded border-l-4 border-yellow-400 bg-yellow-50 p-3">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Refill due on {medication.nextRefill}. Please contact
                        your healthcare provider.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dot" className="space-y-4">
          <div className="mb-4 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-800">
              DOT (Directly Observed Treatment)
            </h3>
            <p className="text-sm text-blue-700">
              These treatments require supervision by a healthcare worker to
              ensure proper compliance.
            </p>
          </div>

          {dotTreatments.map((treatment) => (
            <Card key={treatment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{treatment.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Supervised by: {treatment.supervisor}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">DOT</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Start Date
                    </h4>
                    <p className="font-medium">{treatment.startDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Duration
                    </h4>
                    <p className="font-medium">{treatment.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Next Visit
                    </h4>
                    <p className="font-medium">{treatment.nextVisit}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Status
                    </h4>
                    <p className="font-medium capitalize">{treatment.status}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      Treatment Progress
                    </h4>
                    <span
                      className={`font-bold ${getComplianceColor(treatment.compliance)}`}
                    >
                      {treatment.compliance}%
                    </span>
                  </div>
                  <Progress
                    value={
                      (treatment.dosesCompleted / treatment.totalDoses) * 100
                    }
                    className="mb-2 h-3"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Completed: {treatment.dosesCompleted}/
                      {treatment.totalDoses} doses
                    </span>
                    <span>
                      Remaining:{' '}
                      {treatment.totalDoses - treatment.dosesCompleted} doses
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Visit
                  </Button>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Dose Taken
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {medications.past.map((medication) => (
            <Card key={medication.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {medication.genericName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(medication.status)}
                    <Badge variant="outline">{medication.condition}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Dosage
                    </h4>
                    <p className="font-medium">{medication.dosage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Duration
                    </h4>
                    <p className="font-medium">{medication.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Period
                    </h4>
                    <p className="font-medium">
                      {medication.startDate} to {medication.endDate}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Compliance
                    </h4>
                    <p
                      className={`font-medium ${getComplianceColor(medication.compliance)}`}
                    >
                      {medication.compliance}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Medication Reminders Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
          <p className="text-muted-foreground text-sm">
            Configure how you want to receive medication reminders
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Daily Dose Reminders</h4>
              <p className="text-sm text-gray-600">
                Get notified when it&amps;s time to take your medication
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Refill Reminders</h4>
              <p className="text-sm text-gray-600">
                Get notified 3 days before your medication runs out
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">DOT Visit Reminders</h4>
              <p className="text-sm text-gray-600">
                Get reminded about upcoming supervised treatment visits
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
