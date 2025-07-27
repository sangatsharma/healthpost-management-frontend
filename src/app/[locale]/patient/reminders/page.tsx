'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Calendar,
  Clock,
  Heart,
  Pill,
  Baby,
  Syringe,
  AlertTriangle,
  CheckCircle,
  Plus,
} from 'lucide-react';

export default function RemindersPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock reminders data
  const reminders = [
    {
      id: 1,
      type: 'medication',
      title: 'Take Amlodipine',
      description: '5mg tablet - Morning dose',
      dueTime: '08:00',
      dueDate: '2024-01-20',
      priority: 'high',
      status: 'pending',
      recurring: true,
      icon: Pill,
      category: 'Daily Medication',
    },
    {
      id: 2,
      type: 'checkup',
      title: 'ANC Visit',
      description: 'Week 28 antenatal checkup with Dr. Patel',
      dueTime: '10:00',
      dueDate: '2024-01-25',
      priority: 'high',
      status: 'pending',
      recurring: false,
      icon: Baby,
      category: 'Pregnancy Care',
    },
    {
      id: 3,
      type: 'vaccination',
      title: 'Tetanus Booster',
      description: 'Annual tetanus vaccination due',
      dueTime: '14:00',
      dueDate: '2024-02-01',
      priority: 'medium',
      status: 'scheduled',
      recurring: false,
      icon: Syringe,
      category: 'Immunization',
    },
    {
      id: 4,
      type: 'chronic',
      title: 'Blood Pressure Check',
      description: 'Weekly BP monitoring and logging',
      dueTime: '08:30',
      dueDate: '2024-01-22',
      priority: 'medium',
      status: 'pending',
      recurring: true,
      icon: Heart,
      category: 'Chronic Care',
    },
    {
      id: 5,
      type: 'medication',
      title: 'Iron Supplement',
      description: 'DOT supervised dose with health assistant',
      dueTime: '09:00',
      dueDate: '2024-01-21',
      priority: 'high',
      status: 'overdue',
      recurring: true,
      icon: Pill,
      category: 'DOT Treatment',
    },
    {
      id: 6,
      type: 'followup',
      title: 'Diabetes Follow-up',
      description: 'Monthly diabetes management consultation',
      dueTime: '11:00',
      dueDate: '2024-02-15',
      priority: 'medium',
      status: 'scheduled',
      recurring: true,
      icon: Heart,
      category: 'Chronic Care',
    },
  ];

  // AI-generated alerts
  const aiAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Blood Pressure Trend Alert',
      message:
        'Your BP readings have been consistently above 140/90 for the past week. Consider consulting your doctor.',
      severity: 'high',
      generated: '2024-01-19',
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: 'info',
      title: 'Medication Compliance',
      message:
        'Great job! Your medication compliance has improved to 92% this month.',
      severity: 'low',
      generated: '2024-01-18',
      icon: CheckCircle,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Pregnancy Milestone',
      message:
        "You're now in your 3rd trimester! Time to discuss birth plan with your doctor.",
      severity: 'medium',
      generated: '2024-01-17',
      icon: Baby,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filterReminders = (type: string) => {
    if (type === 'all') return reminders;
    return reminders.filter((reminder) => reminder.type === type);
  };

  const filteredReminders = filterReminders(selectedTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Reminders & Notifications</h1>
          <p className="text-muted-foreground">
            Stay on top of your health with smart reminders
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">
              {reminders.filter((r) => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-600" />
            <div className="text-2xl font-bold text-red-600">
              {reminders.filter((r) => r.status === 'overdue').length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {reminders.filter((r) => r.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">
              {reminders.filter((r) => r.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Smart Health Alerts
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            AI-generated insights based on your health data
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiAlerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <div
                key={alert.id}
                className={`rounded-r-lg border-l-4 p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold">{alert.title}</h4>
                    <p className="mb-2 text-sm text-gray-700">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Generated on {alert.generated}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>My Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="medication">Medication</TabsTrigger>
              <TabsTrigger value="checkup">Checkups</TabsTrigger>
              <TabsTrigger value="vaccination">Vaccines</TabsTrigger>
              <TabsTrigger value="chronic">Chronic</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4 space-y-3">
              {filteredReminders.map((reminder) => {
                const IconComponent = reminder.icon;
                return (
                  <div
                    key={reminder.id}
                    className={`rounded-lg border p-4 ${getPriorityColor(reminder.priority)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5" />
                        <div>
                          <h4 className="font-semibold">{reminder.title}</h4>
                          <p className="text-sm opacity-80">
                            {reminder.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {reminder.dueDate} at {reminder.dueTime}
                            </span>
                            {reminder.recurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(reminder.status)}>
                          {reminder.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
