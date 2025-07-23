'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Heart,
  Droplets,
  Activity,
  Pill,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { TAny } from '@/types/global';

export default function ChronicConditions() {
  const [selectedCondition, setSelectedCondition] = useState('blood-pressure');
  const [showAddReading, setShowAddReading] = useState(false);

  // Mock data for chronic conditions common in Nepal
  const conditions = [
    {
      id: 'blood-pressure',
      name: 'High Blood Pressure',
      nepali: 'उच्च रक्तचाप',
      icon: Heart,
      active: true,
      lastReading: '130/85 mmHg',
      trend: 'stable',
      target: '<140/90 mmHg',
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      nepali: 'मधुमेह',
      icon: Droplets,
      active: true,
      lastReading: '145 mg/dL',
      trend: 'increasing',
      target: '<140 mg/dL',
    },
    {
      id: 'thyroid',
      name: 'Thyroid Disorder',
      nepali: 'थाइरोइड',
      icon: Activity,
      active: false,
      lastReading: 'Normal',
      trend: 'stable',
      target: '0.4-4.0 mIU/L',
    },
    {
      id: 'heart-disease',
      name: 'Heart Disease',
      nepali: 'मुटु रोग',
      icon: Heart,
      active: false,
      lastReading: 'N/A',
      trend: 'stable',
      target: 'Regular monitoring',
    },
    {
      id: 'kidney-disease',
      name: 'Kidney Disease',
      nepali: 'मिर्गौला रोग',
      icon: Droplets,
      active: false,
      lastReading: 'N/A',
      trend: 'stable',
      target: 'eGFR >60',
    },
    {
      id: 'asthma',
      name: 'Asthma',
      nepali: 'दम',
      icon: Activity,
      active: false,
      lastReading: 'N/A',
      trend: 'stable',
      target: 'Symptom control',
    },
  ];

  // Mock readings data
  const readingsData = {
    'blood-pressure': [
      { date: '2024-01-01', systolic: 135, diastolic: 85, time: '08:00' },
      { date: '2024-01-03', systolic: 130, diastolic: 82, time: '08:15' },
      { date: '2024-01-05', systolic: 128, diastolic: 80, time: '08:30' },
      { date: '2024-01-07', systolic: 132, diastolic: 84, time: '08:00' },
      { date: '2024-01-09', systolic: 129, diastolic: 81, time: '08:45' },
    ],
    diabetes: [
      { date: '2024-01-01', fasting: 140, postMeal: 180, time: '08:00' },
      { date: '2024-01-02', fasting: 145, postMeal: 185, time: '08:15' },
      { date: '2024-01-03', fasting: 138, postMeal: 175, time: '08:30' },
      { date: '2024-01-04', fasting: 142, postMeal: 182, time: '08:00' },
      { date: '2024-01-05', fasting: 139, postMeal: 178, time: '08:45' },
    ],
  };

  // Mock medications
  const medications = [
    {
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      condition: 'blood-pressure',
      compliance: 85,
      nextRefill: '2024-02-15',
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      condition: 'diabetes',
      compliance: 92,
      nextRefill: '2024-02-10',
    },
  ];

  // Mock DOT treatment data
  const dotTreatments = [
    {
      name: 'Iron Supplementation',
      startDate: '2024-01-01',
      duration: '90 days',
      dosesCompleted: 45,
      totalDoses: 90,
      compliance: 50,
      status: 'active',
    },
    {
      name: 'Calcium Supplementation',
      startDate: '2024-01-01',
      duration: '60 days',
      dosesCompleted: 55,
      totalDoses: 60,
      compliance: 92,
      status: 'active',
    },
  ];

  const activeConditions = conditions.filter((c) => c.active);
  const currentCondition = conditions.find((c) => c.id === selectedCondition);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl font-bold">
          Chronic Conditions Management
        </h1>
        <p className="text-muted-foreground">
          Monitor and track your chronic health conditions
        </p>
      </div>

      {/* Active Conditions Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeConditions.map((condition) => {
          const IconComponent = condition.icon;
          return (
            <Card
              key={condition.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedCondition(condition.id)}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                  {getTrendIcon(condition.trend)}
                </div>
                <h3 className="mb-1 font-semibold">{condition.name}</h3>
                <p className="mb-2 text-sm text-gray-600">{condition.nepali}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Last Reading:</span>
                    <span className="font-medium">{condition.lastReading}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target:</span>
                    <span className="text-green-600">{condition.target}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      {currentCondition && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <currentCondition.icon className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle>{currentCondition.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {currentCondition.nepali}
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowAddReading(!showAddReading)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Reading
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="readings" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="readings">Readings</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="dot">DOT Treatment</TabsTrigger>
              </TabsList>

              <TabsContent value="readings" className="space-y-4">
                {/* Add Reading Form */}
                {showAddReading && (
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Reading</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedCondition === 'blood-pressure' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="systolic">Systolic (mmHg)</Label>
                            <Input
                              id="systolic"
                              type="number"
                              placeholder="120"
                            />
                          </div>
                          <div>
                            <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                            <Input
                              id="diastolic"
                              type="number"
                              placeholder="80"
                            />
                          </div>
                        </div>
                      )}
                      {selectedCondition === 'diabetes' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fasting">Fasting (mg/dL)</Label>
                            <Input
                              id="fasting"
                              type="number"
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postmeal">Post-meal (mg/dL)</Label>
                            <Input
                              id="postmeal"
                              type="number"
                              placeholder="140"
                            />
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input id="time" type="time" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button>Save Reading</Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddReading(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Readings Table */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Recent Readings
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        {selectedCondition === 'blood-pressure' && (
                          <>
                            <TableHead>Systolic</TableHead>
                            <TableHead>Diastolic</TableHead>
                          </>
                        )}
                        {selectedCondition === 'diabetes' && (
                          <>
                            <TableHead>Fasting</TableHead>
                            <TableHead>Post-meal</TableHead>
                          </>
                        )}
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {readingsData[
                        selectedCondition as keyof typeof readingsData
                      ]?.map((reading, index) => (
                        <TableRow key={index}>
                          <TableCell>{reading.date}</TableCell>
                          <TableCell>{reading.time}</TableCell>
                          {selectedCondition === 'blood-pressure' && (
                            <>
                              <TableCell>
                                {(reading as TAny).systolic}
                              </TableCell>
                              <TableCell>
                                {(reading as TAny).diastolic}
                              </TableCell>
                            </>
                          )}
                          {selectedCondition === 'diabetes' && (
                            <>
                              <TableCell>{(reading as TAny).fasting}</TableCell>
                              <TableCell>
                                {(reading as TAny).postMeal}
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <Badge variant="outline">Normal</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Trend Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={
                          readingsData[
                            selectedCondition as keyof typeof readingsData
                          ]
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        {selectedCondition === 'blood-pressure' && (
                          <>
                            <Line
                              type="monotone"
                              dataKey="systolic"
                              stroke="#8884d8"
                              name="Systolic"
                            />
                            <Line
                              type="monotone"
                              dataKey="diastolic"
                              stroke="#82ca9d"
                              name="Diastolic"
                            />
                          </>
                        )}
                        {selectedCondition === 'diabetes' && (
                          <>
                            <Line
                              type="monotone"
                              dataKey="fasting"
                              stroke="#8884d8"
                              name="Fasting"
                            />
                            <Line
                              type="monotone"
                              dataKey="postMeal"
                              stroke="#82ca9d"
                              name="Post-meal"
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Current Medications
                  </h3>
                  <div className="space-y-3">
                    {medications
                      .filter((med) => med.condition === selectedCondition)
                      .map((medication, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {medication.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {medication.dosage} - {medication.frequency}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Next refill: {medication.nextRefill}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                  {medication.compliance}%
                                </div>
                                <div className="text-sm text-gray-600">
                                  Compliance
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dot" className="space-y-4">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    DOT Treatment Progress
                  </h3>
                  <div className="space-y-4">
                    {dotTreatments.map((treatment, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">
                                {treatment.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Started: {treatment.startDate} | Duration:{' '}
                                {treatment.duration}
                              </p>
                            </div>
                            <Badge
                              variant={
                                treatment.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {treatment.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress:</span>
                              <span>
                                {treatment.dosesCompleted}/
                                {treatment.totalDoses} doses
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{
                                  width: `${(treatment.dosesCompleted / treatment.totalDoses) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Compliance:</span>
                              <span
                                className={`font-medium ${treatment.compliance >= 80 ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {treatment.compliance}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
              <Plus className="mb-2 h-6 w-6" />
              <span className="text-sm">Log Reading</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Pill className="mb-2 h-6 w-6" />
              <span className="text-sm">Mark Medication</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="mb-2 h-6 w-6" />
              <span className="text-sm">Schedule Checkup</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <span className="text-sm">Emergency Alert</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
