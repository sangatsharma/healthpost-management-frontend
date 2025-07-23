'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/zustand/useUserStore';
import { Edit, Save, X } from 'lucide-react';

export default function PatientProfile() {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Editable fields
    address: 'Kathmandu, Nepal',
    contactNumber: '+977-9841234567',
    weight: '65',
    age: '28',
    emergencyContact: '+977-9841234568',
    // Chronic conditions
    hasBloodPressure: false,
    hasDiabetes: false,
    hasThyroid: false,
    hasHeartDisease: false,
    hasAsthma: false,
    hasKidneyDisease: false,
    // Settings
    languagePreference: 'en',
    notificationPreference: 'all',
  });

  // Static fields (non-editable)
  const staticData = {
    healthId: 'HP001234',
    registrationDate: '2023-06-15',
    fullName:
      user?.fullName?.firstName + ' ' + user?.fullName?.lastName ||
      'Patient Name',
    email: user?.email || 'patient@example.com',
    gender: user?.gender || 'Female',
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save to API
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // Show success toast
  };

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false);
  };

  const chronicConditions = [
    {
      key: 'hasBloodPressure',
      label: 'High Blood Pressure (Hypertension)',
      nepali: 'उच्च रक्तचाप',
    },
    { key: 'hasDiabetes', label: 'Diabetes (Blood Sugar)', nepali: 'मधुमेह' },
    { key: 'hasThyroid', label: 'Thyroid Disorder', nepali: 'थाइरोइड' },
    { key: 'hasHeartDisease', label: 'Heart Disease', nepali: 'मुटु रोग' },
    { key: 'hasAsthma', label: 'Asthma', nepali: 'दम' },
    {
      key: 'hasKidneyDisease',
      label: 'Kidney Disease',
      nepali: 'मिर्गौला रोग',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and health settings
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Static Fields */}
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Full Name
                </Label>
                <div className="mt-1 rounded border bg-gray-50 p-2">
                  {staticData.fullName}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Health ID
                </Label>
                <div className="mt-1 flex items-center justify-between rounded border bg-gray-50 p-2">
                  {staticData.healthId}
                  <Badge variant="secondary">Non-editable</Badge>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Email
                </Label>
                <div className="mt-1 rounded border bg-gray-50 p-2">
                  {staticData.email}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Gender
                </Label>
                <div className="mt-1 rounded border bg-gray-50 p-2">
                  {staticData.gender}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Registration Date
                </Label>
                <div className="mt-1 rounded border bg-gray-50 p-2">
                  {staticData.registrationDate}
                </div>
              </div>
            </div>

            <Separator />

            {/* Editable Fields */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleInputChange('contactNumber', e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleInputChange('emergencyContact', e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Conditions & Settings */}
        <div className="space-y-6">
          {/* Chronic Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Chronic Health Conditions</CardTitle>
              <p className="text-muted-foreground text-sm">
                Toggle conditions that apply to you. This helps us provide
                better care.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {chronicConditions.map((condition) => (
                <div
                  key={condition.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="font-medium">{condition.label}</Label>
                    <p className="text-muted-foreground text-sm">
                      {condition.nepali}
                    </p>
                  </div>
                  <Switch
                    checked={
                      formData[
                        condition.key as keyof typeof formData
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      handleInputChange(condition.key, checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Language Preference</Label>
                <Select
                  value={formData.languagePreference}
                  onValueChange={(value) =>
                    handleInputChange('languagePreference', value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="np">नेपाली (Nepali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notifications">Notification Preference</Label>
                <Select
                  value={formData.notificationPreference}
                  onValueChange={(value) =>
                    handleInputChange('notificationPreference', value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="important">Important Only</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Conditions Summary */}
      {Object.entries(formData).some(
        ([key, value]) => key.startsWith('has') && value,
      ) && (
        <Card>
          <CardHeader>
            <CardTitle>Active Health Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {chronicConditions
                .filter(
                  (condition) =>
                    formData[condition.key as keyof typeof formData],
                )
                .map((condition) => (
                  <Badge
                    key={condition.key}
                    variant="outline"
                    className="px-3 py-1"
                  >
                    {condition.label}
                  </Badge>
                ))}
            </div>
            {Object.entries(formData).some(
              ([key, value]) => key.startsWith('has') && value,
            ) && (
              <p className="text-muted-foreground mt-3 text-sm">
                These conditions will be considered in your care plan and
                reminders.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
