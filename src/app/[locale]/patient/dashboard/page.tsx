// "use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Calendar,
  TrendingUp,
  Bell,
  User,
  Activity,
  Pill,
  Baby,
} from 'lucide-react';
// import { useUserStore } from "@/zustand/useUserStore"

export default function PatientDashboard() {
  // const { user } = useUserStore()

  // Mock data - in real app, this would come from API
  const patientData = {
    basicInfo: {
      name: 'Patient',
      age: 28,
      gender: 'Female',
      healthId: 'HP001234',
    },
    lastVisit: {
      date: '2024-01-15',
      doctor: 'Dr. Sharma',
      reason: 'Routine Checkup',
    },
    vitals: {
      bp: '120/80',
      weight: '65kg',
      sugar: '95mg/dl',
      trend: 'stable',
    },
    pregnancy: {
      isPregnant: true,
      week: 24,
      dueDate: '2024-06-15',
    },
    upcomingReminders: [
      { type: 'ANC Visit', date: '2024-01-25', priority: 'high' },
      { type: 'Vaccination', date: '2024-01-30', priority: 'medium' },
      { type: 'BP Checkup', date: '2024-02-01', priority: 'low' },
    ],
    alerts: [
      'You have a check-up due in 2 days',
      'Please take your iron supplements',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h1 className="mb-2 text-2xl font-bold">
          Good Morning, {patientData.basicInfo.name}
        </h1>
        <p className="opacity-90">Here&apos;s your health overview for today</p>
      </div>

      {/* Alert Banners */}
      {patientData.alerts.map((alert, index) => (
        <div
          key={index}
          className="rounded border-l-4 border-yellow-400 bg-yellow-50 p-4"
        >
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-yellow-400" />
            <p className="text-yellow-800">{alert}</p>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Basic Information
            </CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Age:</span>
                <span className="text-sm font-medium">
                  {patientData.basicInfo.age} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Gender:</span>
                <span className="text-sm font-medium">
                  {patientData.basicInfo.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Health ID:
                </span>
                <span className="text-sm font-medium">
                  {patientData.basicInfo.healthId}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Visit Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Date:</span>
                <span className="text-sm font-medium">
                  {patientData.lastVisit.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Doctor:</span>
                <span className="text-sm font-medium">
                  {patientData.lastVisit.doctor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Reason:</span>
                <span className="text-sm font-medium">
                  {patientData.lastVisit.reason}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* vitals Trend Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current vitals
            </CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Blood Pressure:
                </span>
                <Badge variant="outline">{patientData.vitals.bp}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Weight:</span>
                <Badge variant="outline">{patientData.vitals.weight}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Blood Sugar:
                </span>
                <Badge variant="outline">{patientData.vitals.sugar}</Badge>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 capitalize">
                  {patientData.vitals.trend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pregnancy Card (Conditional) */}
        {patientData.pregnancy.isPregnant && (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pregnancy Progress
              </CardTitle>
              <Baby className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">
                    Week {patientData.pregnancy.week}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Your baby is now the size of a corn cob!
                  </p>
                </div>
                <Progress
                  value={(patientData.pregnancy.week / 40) * 100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>Due Date: {patientData.pregnancy.dueDate}</span>
                  <span>{40 - patientData.pregnancy.week} weeks remaining</span>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  View Pregnancy Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Reminders */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Reminders
            </CardTitle>
            <Bell className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patientData.upcomingReminders.map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        reminder.priority === 'high'
                          ? 'bg-red-500'
                          : reminder.priority === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium">{reminder.type}</p>
                      <p className="text-muted-foreground text-sm">
                        {reminder.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      reminder.priority === 'high'
                        ? 'destructive'
                        : reminder.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                    }
                  >
                    {reminder.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full bg-transparent" variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              View All Reminders
            </Button>
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
              <Heart className="mb-2 h-6 w-6" />
              <span className="text-sm">Log vitals</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Pill className="mb-2 h-6 w-6" />
              <span className="text-sm">Medications</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="mb-2 h-6 w-6" />
              <span className="text-sm">Book Visit</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <User className="mb-2 h-6 w-6" />
              <span className="text-sm">Update Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
