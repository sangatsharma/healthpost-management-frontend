'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Baby,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function PregnancyDashboard() {
  const [currentWeek] = useState(24);

  // Mock pregnancy data
  const pregnancyData = {
    currentWeek: currentWeek,
    dueDate: '2024-06-15',
    lastMenstrualPeriod: '2023-09-15',
    trimester: currentWeek <= 12 ? 1 : currentWeek <= 28 ? 2 : 3,
    babySize: getBabySizeMetaphor(currentWeek),
    nextANCVisit: '2024-01-25',
    ancVisits: [
      {
        week: 12,
        date: '2023-12-01',
        status: 'completed',
        doctor: 'Dr. Sharma',
      },
      {
        week: 16,
        date: '2023-12-29',
        status: 'completed',
        doctor: 'Dr. Sharma',
      },
      {
        week: 20,
        date: '2024-01-26',
        status: 'completed',
        doctor: 'Dr. Patel',
      },
      {
        week: 24,
        date: '2024-02-23',
        status: 'upcoming',
        doctor: 'Dr. Sharma',
      },
      {
        week: 28,
        date: '2024-03-22',
        status: 'scheduled',
        doctor: 'Dr. Sharma',
      },
      {
        week: 32,
        date: '2024-04-19',
        status: 'scheduled',
        doctor: 'Dr. Sharma',
      },
      {
        week: 36,
        date: '2024-05-17',
        status: 'scheduled',
        doctor: 'Dr. Sharma',
      },
      {
        week: 40,
        date: '2024-06-14',
        status: 'scheduled',
        doctor: 'Dr. Sharma',
      },
    ],
    nutritionalTips: [
      'Take iron supplements daily with vitamin C',
      'Eat folate-rich foods like green leafy vegetables',
      'Avoid raw or undercooked meat and fish',
      'Stay hydrated - drink at least 8 glasses of water daily',
      'Include calcium-rich foods like milk and yogurt',
    ],
    warnings: [
      'Avoid alcohol and smoking completely',
      'Limit caffeine intake to less than 200mg per day',
      'Avoid high-mercury fish',
      "Don't take any medications without consulting your doctor",
    ],
  };

  function getBabySizeMetaphor(week: number) {
    const metaphors = {
      8: { size: 'Kidney Bean', nepali: 'राजमा', length: '1.6 cm' },
      12: { size: 'Lime', nepali: 'कागती', length: '5.4 cm' },
      16: { size: 'Avocado', nepali: 'बटर फ्रुट', length: '11.6 cm' },
      20: { size: 'Banana', nepali: 'केरा', length: '16.4 cm' },
      24: { size: 'Corn Cob', nepali: 'मकै', length: '21 cm' },
      28: { size: 'Eggplant', nepali: 'भन्टा', length: '25 cm' },
      32: { size: 'Coconut', nepali: 'नरिवल', length: '28 cm' },
      36: { size: 'Papaya', nepali: 'मेवा', length: '32 cm' },
      40: { size: 'Watermelon', nepali: 'तरबुज', length: '36 cm' },
    };

    const closest = Object.keys(metaphors)
      .map(Number)
      .reduce((prev, curr) =>
        Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev,
      );

    return metaphors[closest as keyof typeof metaphors];
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
        <h1 className="mb-2 text-2xl font-bold">Pregnancy Dashboard</h1>
        <p className="opacity-90">Track your pregnancy journey week by week</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Week & Baby Size */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Week {pregnancyData.currentWeek} of Pregnancy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>{pregnancyData.currentWeek}/40 weeks</span>
              </div>
              <Progress
                value={(pregnancyData.currentWeek / 40) * 100}
                className="h-3"
              />
            </div>

            {/* Baby Size */}
            <div className="rounded-lg bg-pink-50 p-6 text-center">
              <div className="mb-2 text-4xl">👶</div>
              <h3 className="mb-2 text-xl font-semibold">
                Your baby is now the size of a
              </h3>
              <div className="mb-1 text-2xl font-bold text-pink-600">
                {pregnancyData.babySize.size}
              </div>
              <div className="mb-2 text-lg text-gray-600">
                {pregnancyData.babySize.nepali}
              </div>
              <div className="text-sm text-gray-500">
                Approximately {pregnancyData.babySize.length} long
              </div>
            </div>

            {/* Key Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <Calendar className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                <div className="text-sm text-gray-600">Due Date</div>
                <div className="font-semibold">{pregnancyData.dueDate}</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <Heart className="mx-auto mb-2 h-6 w-6 text-green-600" />
                <div className="text-sm text-gray-600">Trimester</div>
                <div className="font-semibold">
                  {pregnancyData.trimester}nd Trimester
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next ANC Visit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next ANC Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <div className="text-3xl">📅</div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {pregnancyData.nextANCVisit}
                </div>
                <div className="text-sm text-gray-600">Week 24 Checkup</div>
              </div>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Reschedule Visit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ANC Visit Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>ANC Visit Timeline</CardTitle>
          <p className="text-muted-foreground text-sm">
            Track your antenatal care visits throughout pregnancy
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pregnancyData.ancVisits.map((visit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div
                  className={`h-4 w-4 rounded-full ${getStatusColor(visit.status)}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Week {visit.week} Visit</p>
                      <p className="text-sm text-gray-600">
                        {visit.date} - {visit.doctor}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(visit.status)}
                      <Badge
                        variant={
                          visit.status === 'completed'
                            ? 'default'
                            : visit.status === 'upcoming'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {visit.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Nutritional Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Nutritional Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pregnancyData.nutritionalTips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Important Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pregnancyData.warnings.map((warning, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <span className="text-sm">{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="mb-2 h-6 w-6" />
              <span className="text-sm">Book ANC Visit</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Heart className="mb-2 h-6 w-6" />
              <span className="text-sm">Log Symptoms</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Baby className="mb-2 h-6 w-6" />
              <span className="text-sm">Baby Movement</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <span className="text-sm">Emergency Contact</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
