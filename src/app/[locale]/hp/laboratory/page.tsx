'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, User, FileText, TestTube } from 'lucide-react';
import { format } from 'date-fns';
import { TAny } from '@/types/global';

// Zod Schemas
const patientSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
});

const labTestSchema = z.object({
  testId: z.string().min(1, 'Test ID is required'),
  testName: z.string().min(1, 'Test name is required'),
  category: z.enum(
    ['hematology', 'biochemistry', 'microbiology', 'immunology', 'pathology'],
    {
      required_error: 'Test category is required',
    },
  ),
  priority: z.enum(['routine', 'urgent', 'stat'], {
    required_error: 'Priority is required',
  }),
  instructions: z.string().optional(),
});

const labResultSchema = z.object({
  parameter: z.string().min(1, 'Parameter name is required'),
  value: z.string().min(1, 'Value is required'),
  unit: z.string().min(1, 'Unit is required'),
  referenceRange: z.string().min(1, 'Reference range is required'),
  status: z.enum(['normal', 'high', 'low', 'critical'], {
    required_error: 'Status is required',
  }),
  notes: z.string().optional(),
});

const labReportRequestSchema = z.object({
  patient: patientSchema,
  requestedTests: z
    .array(labTestSchema)
    .min(1, 'At least one test must be requested'),
  clinicalHistory: z
    .string()
    .min(10, 'Clinical history must be at least 10 characters'),
  symptoms: z.string().optional(),
  requestingPhysician: z
    .string()
    .min(2, 'Requesting physician name is required'),
  requestDate: z.string().min(1, 'Request date is required'),
  expectedDate: z.string().min(1, 'Expected completion date is required'),
});

const labReportEntrySchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  patient: patientSchema,
  testResults: z
    .array(labResultSchema)
    .min(1, 'At least one test result is required'),
  overallInterpretation: z
    .string()
    .min(20, 'Overall interpretation must be at least 20 characters'),
  recommendations: z.string().optional(),
  performedBy: z.string().min(2, 'Lab technician name is required'),
  reviewedBy: z.string().min(2, 'Reviewing physician name is required'),
  reportDate: z.string().min(1, 'Report date is required'),
  status: z.enum(['pending', 'completed', 'reviewed', 'released'], {
    required_error: 'Report status is required',
  }),
});

type LabReportRequest = z.infer<typeof labReportRequestSchema>;
type LabReportEntry = z.infer<typeof labReportEntrySchema>;

const commonLabTests = [
  { id: 'CBC', name: 'Complete Blood Count', category: 'hematology' },
  { id: 'BMP', name: 'Basic Metabolic Panel', category: 'biochemistry' },
  { id: 'LFT', name: 'Liver Function Tests', category: 'biochemistry' },
  { id: 'TSH', name: 'Thyroid Stimulating Hormone', category: 'immunology' },
  { id: 'HbA1c', name: 'Hemoglobin A1c', category: 'biochemistry' },
  { id: 'URINE', name: 'Urinalysis', category: 'biochemistry' },
  { id: 'CULTURE', name: 'Blood Culture', category: 'microbiology' },
];

const commonParameters = {
  CBC: [
    { parameter: 'Hemoglobin', unit: 'g/dL', referenceRange: '12.0-15.5' },
    { parameter: 'Hematocrit', unit: '%', referenceRange: '36-46' },
    { parameter: 'WBC Count', unit: 'x10³/μL', referenceRange: '4.5-11.0' },
    { parameter: 'Platelet Count', unit: 'x10³/μL', referenceRange: '150-450' },
  ],
  BMP: [
    { parameter: 'Glucose', unit: 'mg/dL', referenceRange: '70-100' },
    { parameter: 'Sodium', unit: 'mEq/L', referenceRange: '136-145' },
    { parameter: 'Potassium', unit: 'mEq/L', referenceRange: '3.5-5.1' },
    { parameter: 'Creatinine', unit: 'mg/dL', referenceRange: '0.7-1.3' },
  ],
};

export default function LabReportSystem() {
  const [activeTab, setActiveTab] = useState('request');

  // Request Form
  const requestForm = useForm<LabReportRequest>({
    resolver: zodResolver(labReportRequestSchema),
    defaultValues: {
      patient: {
        patientId: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        phoneNumber: '',
        email: '',
        address: '',
        emergencyContact: '',
      },
      requestedTests: [],
      clinicalHistory: '',
      symptoms: '',
      requestingPhysician: '',
      requestDate: format(new Date(), 'yyyy-MM-dd'),
      expectedDate: '',
    },
  });

  const {
    fields: requestTestFields,
    append: appendRequestTest,
    remove: removeRequestTest,
  } = useFieldArray({
    control: requestForm.control,
    name: 'requestedTests',
  });

  // Entry Form
  const entryForm = useForm<LabReportEntry>({
    resolver: zodResolver(labReportEntrySchema),
    defaultValues: {
      reportId: '',
      patient: {
        patientId: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        phoneNumber: '',
        email: '',
        address: '',
        emergencyContact: '',
      },
      testResults: [],
      overallInterpretation: '',
      recommendations: '',
      performedBy: '',
      reviewedBy: '',
      reportDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
    },
  });

  const {
    fields: resultFields,
    append: appendResult,
    remove: removeResult,
  } = useFieldArray({
    control: entryForm.control,
    name: 'testResults',
  });

  const onSubmitRequest = (data: LabReportRequest) => {
    console.log('Lab Report Request:', data);
    // Handle form submission
  };

  const onSubmitEntry = (data: LabReportEntry) => {
    console.log('Lab Report Entry:', data);
    // Handle form submission
  };

  const addCommonTest = (testId: string) => {
    const test = commonLabTests.find((t) => t.id === testId);
    if (test) {
      appendRequestTest({
        testId: test.id,
        testName: test.name,
        category: test.category as TAny,
        priority: 'routine',
        instructions: '',
      });
    }
  };

  const addCommonParameters = (testId: string) => {
    const parameters =
      commonParameters[testId as keyof typeof commonParameters];
    if (parameters) {
      parameters.forEach((param) => {
        appendResult({
          parameter: param.parameter,
          value: '',
          unit: param.unit,
          referenceRange: param.referenceRange,
          status: 'normal',
          notes: '',
        });
      });
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Lab Report Management
        </h1>
        <p className="text-gray-600">
          Manage lab test requests and report entries for HealthPost
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Lab Test Request
          </TabsTrigger>
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Lab Report Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-6">
          <form
            onSubmit={requestForm.handleSubmit(onSubmitRequest)}
            className="space-y-6"
          >
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
                <CardDescription>
                  Enter patient details for lab test request
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID *</Label>
                  <Input
                    id="patientId"
                    {...requestForm.register('patient.patientId')}
                    placeholder="P001234"
                  />
                  {requestForm.formState.errors.patient?.patientId && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.patientId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...requestForm.register('patient.firstName')}
                    placeholder="John"
                  />
                  {requestForm.formState.errors.patient?.firstName && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...requestForm.register('patient.lastName')}
                    placeholder="Doe"
                  />
                  {requestForm.formState.errors.patient?.lastName && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...requestForm.register('patient.dateOfBirth')}
                  />
                  {requestForm.formState.errors.patient?.dateOfBirth && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    onValueChange={(value) =>
                      requestForm.setValue('patient.gender', value as TAny)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {requestForm.formState.errors.patient?.gender && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    {...requestForm.register('patient.phoneNumber')}
                    placeholder="+1234567890"
                  />
                  {requestForm.formState.errors.patient?.phoneNumber && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...requestForm.register('patient.address')}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                  {requestForm.formState.errors.patient?.address && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.patient.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    {...requestForm.register('patient.emergencyContact')}
                    placeholder="+1234567890"
                  />
                  {requestForm.formState.errors.patient?.emergencyContact && (
                    <p className="text-sm text-red-600">
                      {
                        requestForm.formState.errors.patient.emergencyContact
                          .message
                      }
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Requested Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Requested Lab Tests</CardTitle>
                <CardDescription>
                  Select and configure lab tests to be performed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {commonLabTests.map((test) => (
                    <Button
                      key={test.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCommonTest(test.id)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      {test.name}
                    </Button>
                  ))}
                </div>

                <Separator />

                {requestTestFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Test ID *</Label>
                        <Input
                          {...requestForm.register(
                            `requestedTests.${index}.testId`,
                          )}
                          placeholder="TEST001"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Test Name *</Label>
                        <Input
                          {...requestForm.register(
                            `requestedTests.${index}.testName`,
                          )}
                          placeholder="Complete Blood Count"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select
                          onValueChange={(value) =>
                            requestForm.setValue(
                              `requestedTests.${index}.category`,
                              value as TAny,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hematology">
                              Hematology
                            </SelectItem>
                            <SelectItem value="biochemistry">
                              Biochemistry
                            </SelectItem>
                            <SelectItem value="microbiology">
                              Microbiology
                            </SelectItem>
                            <SelectItem value="immunology">
                              Immunology
                            </SelectItem>
                            <SelectItem value="pathology">Pathology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Priority *</Label>
                        <Select
                          onValueChange={(value) =>
                            requestForm.setValue(
                              `requestedTests.${index}.priority`,
                              value as TAny,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="stat">STAT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <Label>Special Instructions</Label>
                        <Input
                          {...requestForm.register(
                            `requestedTests.${index}.instructions`,
                          )}
                          placeholder="Fasting required, morning collection preferred..."
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRequestTest(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {requestForm.formState.errors.requestedTests && (
                  <p className="text-sm text-red-600">
                    {requestForm.formState.errors.requestedTests.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Clinical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Information</CardTitle>
                <CardDescription>
                  Provide clinical context for the lab tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requestingPhysician">
                      Requesting Physician *
                    </Label>
                    <Input
                      id="requestingPhysician"
                      {...requestForm.register('requestingPhysician')}
                      placeholder="Dr. Smith"
                    />
                    {requestForm.formState.errors.requestingPhysician && (
                      <p className="text-sm text-red-600">
                        {
                          requestForm.formState.errors.requestingPhysician
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDate">
                      Expected Completion Date *
                    </Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      {...requestForm.register('expectedDate')}
                    />
                    {requestForm.formState.errors.expectedDate && (
                      <p className="text-sm text-red-600">
                        {requestForm.formState.errors.expectedDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicalHistory">Clinical History *</Label>
                  <Textarea
                    id="clinicalHistory"
                    {...requestForm.register('clinicalHistory')}
                    placeholder="Patient presents with symptoms of..."
                    rows={3}
                  />
                  {requestForm.formState.errors.clinicalHistory && (
                    <p className="text-sm text-red-600">
                      {requestForm.formState.errors.clinicalHistory.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Current Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    {...requestForm.register('symptoms')}
                    placeholder="Fever, fatigue, headache..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Submit Lab Test Request
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="entry" className="space-y-6">
          <form
            onSubmit={entryForm.handleSubmit(onSubmitEntry)}
            className="space-y-6"
          >
            {/* Report Header */}
            <Card>
              <CardHeader>
                <CardTitle>Lab Report Entry</CardTitle>
                <CardDescription>
                  Enter lab test results and interpretations
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="reportId">Report ID *</Label>
                  <Input
                    id="reportId"
                    {...entryForm.register('reportId')}
                    placeholder="RPT001234"
                  />
                  {entryForm.formState.errors.reportId && (
                    <p className="text-sm text-red-600">
                      {entryForm.formState.errors.reportId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportDate">Report Date *</Label>
                  <Input
                    id="reportDate"
                    type="date"
                    {...entryForm.register('reportDate')}
                  />
                  {entryForm.formState.errors.reportDate && (
                    <p className="text-sm text-red-600">
                      {entryForm.formState.errors.reportDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Report Status *</Label>
                  <Select
                    onValueChange={(value) =>
                      entryForm.setValue('status', value as TAny)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                    </SelectContent>
                  </Select>
                  {entryForm.formState.errors.status && (
                    <p className="text-sm text-red-600">
                      {entryForm.formState.errors.status.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Patient Information (simplified for entry) */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="entryPatientId">Patient ID *</Label>
                  <Input
                    id="entryPatientId"
                    {...entryForm.register('patient.patientId')}
                    placeholder="P001234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryFirstName">First Name *</Label>
                  <Input
                    id="entryFirstName"
                    {...entryForm.register('patient.firstName')}
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryLastName">Last Name *</Label>
                  <Input
                    id="entryLastName"
                    {...entryForm.register('patient.lastName')}
                    placeholder="Doe"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Enter individual test parameters and results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(commonParameters).map((testId) => (
                    <Button
                      key={testId}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCommonParameters(testId)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add {testId} Parameters
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendResult({
                        parameter: '',
                        value: '',
                        unit: '',
                        referenceRange: '',
                        status: 'normal',
                        notes: '',
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Custom Parameter
                  </Button>
                </div>

                <Separator />

                {resultFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
                      <div className="space-y-2">
                        <Label>Parameter *</Label>
                        <Input
                          {...entryForm.register(
                            `testResults.${index}.parameter`,
                          )}
                          placeholder="Hemoglobin"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Value *</Label>
                        <Input
                          {...entryForm.register(`testResults.${index}.value`)}
                          placeholder="12.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unit *</Label>
                        <Input
                          {...entryForm.register(`testResults.${index}.unit`)}
                          placeholder="g/dL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Reference Range *</Label>
                        <Input
                          {...entryForm.register(
                            `testResults.${index}.referenceRange`,
                          )}
                          placeholder="12.0-15.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Status *</Label>
                        <Select
                          onValueChange={(value) =>
                            entryForm.setValue(
                              `testResults.${index}.status`,
                              value as TAny,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeResult(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 md:col-span-2 lg:col-span-6">
                        <Label>Notes</Label>
                        <Input
                          {...entryForm.register(`testResults.${index}.notes`)}
                          placeholder="Additional observations or comments..."
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                {entryForm.formState.errors.testResults && (
                  <p className="text-sm text-red-600">
                    {entryForm.formState.errors.testResults.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Interpretation and Staff */}
            <Card>
              <CardHeader>
                <CardTitle>Interpretation & Staff Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="overallInterpretation">
                    Overall Interpretation *
                  </Label>
                  <Textarea
                    id="overallInterpretation"
                    {...entryForm.register('overallInterpretation')}
                    placeholder="The laboratory results indicate..."
                    rows={4}
                  />
                  {entryForm.formState.errors.overallInterpretation && (
                    <p className="text-sm text-red-600">
                      {entryForm.formState.errors.overallInterpretation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    {...entryForm.register('recommendations')}
                    placeholder="Recommend follow-up testing, clinical correlation..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="performedBy">Performed By *</Label>
                    <Input
                      id="performedBy"
                      {...entryForm.register('performedBy')}
                      placeholder="Lab Technician Name"
                    />
                    {entryForm.formState.errors.performedBy && (
                      <p className="text-sm text-red-600">
                        {entryForm.formState.errors.performedBy.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewedBy">Reviewed By *</Label>
                    <Input
                      id="reviewedBy"
                      {...entryForm.register('reviewedBy')}
                      placeholder="Dr. Pathologist Name"
                    />
                    {entryForm.formState.errors.reviewedBy && (
                      <p className="text-sm text-red-600">
                        {entryForm.formState.errors.reviewedBy.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Save Lab Report
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
