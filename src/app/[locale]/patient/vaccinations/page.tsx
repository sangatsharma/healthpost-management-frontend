'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Syringe,
  Baby,
} from 'lucide-react';
import { TAny } from '@/types/global';

export default function VaccinationRecords() {
  const [selectedCategory, setSelectedCategory] = useState<
    'adult' | 'pregnancy' | 'infant'
  >('adult');

  // Mock vaccination data
  const vaccinationData = {
    adult: [
      {
        name: 'Tetanus Toxoid (TT)',
        dueDate: '2024-02-15',
        status: 'upcoming',
        lastTaken: '2023-02-15',
        nextDue: '2024-02-15',
      },
      {
        name: 'Hepatitis B',
        dueDate: '2024-06-15',
        status: 'completed',
        lastTaken: '2023-06-15',
        nextDue: '2024-06-15',
      },
      {
        name: 'Influenza (Flu)',
        dueDate: '2024-01-30',
        status: 'overdue',
        lastTaken: '2023-01-15',
        nextDue: '2024-01-15',
      },
      {
        name: 'COVID-19 Booster',
        dueDate: '2024-03-01',
        status: 'scheduled',
        lastTaken: '2023-09-01',
        nextDue: '2024-03-01',
      },
    ],
    pregnancy: [
      {
        name: 'Tetanus Toxoid (TT1)',
        dueDate: '2023-10-15',
        status: 'completed',
        lastTaken: '2023-10-15',
        nextDue: null,
      },
      {
        name: 'Tetanus Toxoid (TT2)',
        dueDate: '2023-11-15',
        status: 'completed',
        lastTaken: '2023-11-15',
        nextDue: null,
      },
      {
        name: 'Influenza (Pregnancy)',
        dueDate: '2023-12-01',
        status: 'completed',
        lastTaken: '2023-12-01',
        nextDue: null,
      },
      {
        name: 'Tdap (Whooping Cough)',
        dueDate: '2024-02-01',
        status: 'upcoming',
        lastTaken: null,
        nextDue: '2024-02-01',
      },
    ],
    infant: [
      {
        name: 'BCG',
        dueDate: 'At Birth',
        status: 'scheduled',
        lastTaken: null,
        nextDue: 'At Birth',
      },
      {
        name: 'Hepatitis B (Birth)',
        dueDate: 'Within 24 hours',
        status: 'scheduled',
        lastTaken: null,
        nextDue: 'Within 24 hours',
      },
      {
        name: 'DTP-HepB-Hib (1st)',
        dueDate: '6 weeks',
        status: 'scheduled',
        lastTaken: null,
        nextDue: '6 weeks',
      },
      {
        name: 'Polio (OPV1)',
        dueDate: '6 weeks',
        status: 'scheduled',
        lastTaken: null,
        nextDue: '6 weeks',
      },
      {
        name: 'Pneumococcal (PCV1)',
        dueDate: '6 weeks',
        status: 'scheduled',
        lastTaken: null,
        nextDue: '6 weeks',
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'scheduled':
        return (
          <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calculateCompletionRate = (vaccines: TAny[]) => {
    const completed = vaccines.filter((v) => v.status === 'completed').length;
    return Math.round((completed / vaccines.length) * 100);
  };

  const currentVaccines = vaccinationData[selectedCategory];
  const completionRate = calculateCompletionRate(currentVaccines);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl font-bold">Vaccination Records</h1>
        <p className="text-muted-foreground">
          Track your vaccination history and upcoming immunizations
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex w-fit space-x-1 rounded-lg bg-gray-100 p-1">
        <Button
          variant={selectedCategory === 'adult' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('adult')}
        >
          <Syringe className="mr-2 h-4 w-4" />
          Adult Vaccines
        </Button>
        <Button
          variant={selectedCategory === 'pregnancy' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('pregnancy')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Pregnancy Vaccines
        </Button>
        <Button
          variant={selectedCategory === 'infant' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('infant')}
        >
          <Baby className="mr-2 h-4 w-4" />
          Infant Schedule
        </Button>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vaccination Progress</span>
            <span className="text-2xl font-bold text-blue-600">
              {completionRate}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionRate} className="mb-4 h-3" />
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {currentVaccines.filter((v) => v.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {currentVaccines.filter((v) => v.status === 'upcoming').length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {currentVaccines.filter((v) => v.status === 'overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {currentVaccines.filter((v) => v.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === 'adult' && 'Adult Vaccination Schedule'}
            {selectedCategory === 'pregnancy' &&
              'Pregnancy Vaccination Schedule'}
            {selectedCategory === 'infant' && 'Infant Vaccination Schedule'}
          </CardTitle>
          {selectedCategory === 'infant' && (
            <p className="text-muted-foreground text-sm">
              This schedule will be activated after delivery for your
              baby&apos;s immunizations
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaccine Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Taken</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVaccines.map((vaccine, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(vaccine.status)}
                      <span className="font-medium">{vaccine.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(vaccine.status)}</TableCell>
                  <TableCell>{vaccine.lastTaken || 'Not taken'}</TableCell>
                  <TableCell>{vaccine.nextDue || 'N/A'}</TableCell>
                  <TableCell>
                    {vaccine.status === 'upcoming' ||
                    vaccine.status === 'overdue' ? (
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                    ) : vaccine.status === 'scheduled' ? (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        Completed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Special Alerts */}
      {selectedCategory === 'pregnancy' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Pregnancy Vaccination Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-orange-800">
              <li>
                • Tetanus Toxoid (TT) is crucial for preventing neonatal tetanus
              </li>
              <li>
                • Influenza vaccine is recommended during pregnancy to protect
                both mother and baby
              </li>
              <li>
                • Tdap vaccine should be given between 27-36 weeks of pregnancy
              </li>
              <li>
                • Always consult your healthcare provider before taking any
                vaccine
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {selectedCategory === 'infant' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Baby className="h-5 w-5" />
              Infant Vaccination Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                • BCG vaccine protects against tuberculosis and should be given
                at birth
              </li>
              <li>
                • Hepatitis B vaccine should be given within 24 hours of birth
              </li>
              <li>
                • DTP-HepB-Hib combination vaccine starts at 6 weeks of age
              </li>
              <li>
                • Follow the national immunization schedule for optimal
                protection
              </li>
              <li>
                • Keep vaccination records safe for school enrollment and travel
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="mb-2 h-6 w-6" />
              <span className="text-sm">Schedule Vaccine</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Syringe className="mb-2 h-6 w-6" />
              <span className="text-sm">View Certificate</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <span className="text-sm">Report Side Effect</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <CheckCircle className="mb-2 h-6 w-6" />
              <span className="text-sm">Update Record</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
