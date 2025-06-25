'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Weight,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Building2,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState } from 'react';
// import { useTypedTranslations } from '@/hooks/useTypedTranslations';

// Medical History Types
interface MedicalRecord {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: {
    en: string;
    np: string;
  };
  age: number;
  gender: {
    en: 'Male' | 'Female' | 'Other';
    np: 'पुरुष' | 'महिला' | 'अन्य';
  };
  diagnosis: {
    en: string;
    np: string;
  };
  symptoms: {
    en: string[];
    np: string[];
  };
  treatment: {
    en: string;
    np: string;
  };
  medications: {
    name: {
      en: string;
      np: string;
    };
    dosage: string;
    frequency: {
      en: string;
      np: string;
    };
    duration: {
      en: string;
      np: string;
    };
  }[];
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
    height?: string;
  };
  doctorName: {
    en: string;
    np: string;
  };
  healthPost: {
    en: string;
    np: string;
  };
  status: 'completed' | 'ongoing' | 'followup_required';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: {
    en: string;
    np: string;
  };
  nextAppointment?: string;
}

export default function History() {
  const locale = useLocale();
  const isNepali = locale === 'np';
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'completed' | 'ongoing' | 'followup_required'
  >('all');

  // Dummy Medical Records Data
  const medicalRecords: MedicalRecord[] = [
    {
      id: 'MR001',
      date: '2024-06-20',
      time: '10:30 AM',
      patientId: 'P001',
      patientName: {
        en: 'Ram Bahadur Thapa',
        np: 'राम बहादुर थापा',
      },
      age: 45,
      gender: {
        en: 'Male',
        np: 'पुरुष',
      },
      diagnosis: {
        en: 'Hypertension with Type 2 Diabetes',
        np: 'उच्च रक्तचाप र मधुमेह रोग',
      },
      symptoms: {
        en: [
          'High blood pressure',
          'Frequent urination',
          'Excessive thirst',
          'Fatigue',
        ],
        np: [
          'उच्च रक्तचाप',
          'बारम्बार पिसाब लाग्ने',
          'धेरै तिर्खा लाग्ने',
          'थकान',
        ],
      },
      treatment: {
        en: 'Medication therapy with lifestyle modifications',
        np: 'औषधि चिकित्सा र जीवनशैली परिमार्जन',
      },
      medications: [
        {
          name: { en: 'Amlodipine', np: 'एम्लोडिपिन' },
          dosage: '5mg',
          frequency: { en: 'Once daily', np: 'दिनमा एक पटक' },
          duration: { en: '3 months', np: '३ महिना' },
        },
        {
          name: { en: 'Metformin', np: 'मेटफर्मिन' },
          dosage: '500mg',
          frequency: { en: 'Twice daily', np: 'दिनमा दुई पटक' },
          duration: { en: '3 months', np: '३ महिना' },
        },
      ],
      vitals: {
        bloodPressure: '150/95 mmHg',
        temperature: '98.6°F',
        heartRate: '82 bpm',
        weight: '75 kg',
        height: '168 cm',
      },
      doctorName: {
        en: 'Dr. Sita Sharma',
        np: 'डा. सीता शर्मा',
      },
      healthPost: {
        en: 'Kathmandu Central Health Post',
        np: 'काठमाडौं केन्द्रीय स्वास्थ्य पोस्ट',
      },
      status: 'ongoing',
      priority: 'high',
      notes: {
        en: 'Patient advised to monitor blood sugar levels daily and return for follow-up in 2 weeks.',
        np: 'बिरामीलाई दैनिक रक्त चिनीको मात्रा जाँच गर्न र २ हप्तामा फलो-अप गर्न सल्लाह दिइएको।',
      },
      nextAppointment: '2024-07-04',
    },
    {
      id: 'MR002',
      date: '2024-06-18',
      time: '2:15 PM',
      patientId: 'P002',
      patientName: {
        en: 'Maya Devi Gurung',
        np: 'माया देवी गुरुङ',
      },
      age: 32,
      gender: {
        en: 'Female',
        np: 'महिला',
      },
      diagnosis: {
        en: 'Respiratory Tract Infection',
        np: 'श्वासप्रश्वास संक्रमण',
      },
      symptoms: {
        en: ['Cough', 'Fever', 'Sore throat', 'Body aches'],
        np: ['खोकी', 'ज्वरो', 'घाँटी दुख्ने', 'शरीर दुख्ने'],
      },
      treatment: {
        en: 'Antibiotic therapy with symptomatic treatment',
        np: 'एन्टिबायोटिक औषधि र लक्षणगत उपचार',
      },
      medications: [
        {
          name: { en: 'Azithromycin', np: 'एजिथ्रोमाइसिन' },
          dosage: '500mg',
          frequency: { en: 'Once daily', np: 'दिनमा एक पटक' },
          duration: { en: '5 days', np: '५ दिन' },
        },
        {
          name: { en: 'Paracetamol', np: 'प्यारासिटामोल' },
          dosage: '500mg',
          frequency: { en: 'Every 6 hours', np: '६ घण्टामा' },
          duration: { en: 'As needed', np: 'आवश्यकता अनुसार' },
        },
      ],
      vitals: {
        bloodPressure: '120/80 mmHg',
        temperature: '101.2°F',
        heartRate: '88 bpm',
        weight: '58 kg',
      },
      doctorName: {
        en: 'Dr. Rajesh Karki',
        np: 'डा. राजेश कार्की',
      },
      healthPost: {
        en: 'Pokhara Valley Health Center',
        np: 'पोखरा उपत्यका स्वास्थ्य केन्द्र',
      },
      status: 'completed',
      priority: 'medium',
      notes: {
        en: 'Patient recovered well. Advised to complete the antibiotic course and rest.',
        np: 'बिरामी राम्रोसँग निको भएको। एन्टिबायोटिक कोर्स पूरा गर्न र आराम गर्न सल्लाह दिइएको।',
      },
    },
    {
      id: 'MR003',
      date: '2024-06-15',
      time: '11:45 AM',
      patientId: 'P003',
      patientName: {
        en: 'Bikash Adhikari',
        np: 'विकाश अधिकारी',
      },
      age: 28,
      gender: {
        en: 'Male',
        np: 'पुरुष',
      },
      diagnosis: {
        en: 'Acute Gastritis',
        np: 'तीव्र पेट दुख्ने रोग',
      },
      symptoms: {
        en: ['Stomach pain', 'Nausea', 'Vomiting', 'Loss of appetite'],
        np: ['पेट दुख्ने', 'बान्ता लाग्ने', 'बान्ता हुने', 'भोक नलाग्ने'],
      },
      treatment: {
        en: 'Proton pump inhibitors with dietary modifications',
        np: 'प्रोटोन पम्प इन्हिबिटर र खानपानमा परिवर्तन',
      },
      medications: [
        {
          name: { en: 'Omeprazole', np: 'ओमेप्राजोल' },
          dosage: '20mg',
          frequency: { en: 'Twice daily', np: 'दिनमा दुई पटक' },
          duration: { en: '2 weeks', np: '२ हप्ता' },
        },
        {
          name: { en: 'Domperidone', np: 'डोम्पेरिडोन' },
          dosage: '10mg',
          frequency: { en: 'Before meals', np: 'खाना खानु अगाडि' },
          duration: { en: '1 week', np: '१ हप्ता' },
        },
      ],
      vitals: {
        bloodPressure: '115/75 mmHg',
        temperature: '98.4°F',
        heartRate: '76 bpm',
        weight: '68 kg',
      },
      doctorName: {
        en: 'Dr. Anita Poudel',
        np: 'डा. अनिता पौडेल',
      },
      healthPost: {
        en: 'Chitwan Community Health Post',
        np: 'चितवन सामुदायिक स्वास्थ्य पोस्ट',
      },
      status: 'followup_required',
      priority: 'medium',
      notes: {
        en: 'Patient advised to avoid spicy food and alcohol. Follow-up required after medication course.',
        np: 'बिरामीलाई मसालेदार खाना र रक्सी नखान सल्लाह दिइएको। औषधि सकिएपछि फलो-अप आवश्यक।',
      },
      nextAppointment: '2024-06-29',
    },
  ];

  // Locale-based labels
  const getLabels = () => ({
    title: isNepali ? 'चिकित्सा इतिहास' : 'Medical History',
    subtitle: isNepali
      ? 'बिरामीको पूर्ण चिकित्सा रेकर्ड'
      : 'Complete Medical Records of Patient',
    patientInfo: isNepali ? 'बिरामीको जानकारी' : 'Patient Information',
    diagnosis: isNepali ? 'निदान' : 'Diagnosis',
    symptoms: isNepali ? 'लक्षणहरू' : 'Symptoms',
    treatment: isNepali ? 'उपचार' : 'Treatment',
    medications: isNepali ? 'औषधिहरू' : 'Medications',
    vitals: isNepali ? 'महत्वपूर्ण संकेतहरू' : 'Vital Signs',
    doctor: isNepali ? 'चिकित्सक' : 'Doctor',
    healthPost: isNepali ? 'स्वास्थ्य पोस्ट' : 'Health Post',
    date: isNepali ? 'मिति' : 'Date',
    time: isNepali ? 'समय' : 'Time',
    age: isNepali ? 'उमेर' : 'Age',
    gender: isNepali ? 'लिङ्ग' : 'Gender',
    notes: isNepali ? 'टिप्पणी' : 'Notes',
    nextAppointment: isNepali ? 'अर्को भेट' : 'Next Appointment',
    status: isNepali ? 'स्थिति' : 'Status',
    priority: isNepali ? 'प्राथमिकता' : 'Priority',
    bloodPressure: isNepali ? 'रक्तचाप' : 'Blood Pressure',
    temperature: isNepali ? 'तापक्रम' : 'Temperature',
    heartRate: isNepali ? 'मुटुको धड्कन' : 'Heart Rate',
    weight: isNepali ? 'तौल' : 'Weight',
    height: isNepali ? 'उचाइ' : 'Height',
    dosage: isNepali ? 'खुराक' : 'Dosage',
    frequency: isNepali ? 'आवृत्ति' : 'Frequency',
    duration: isNepali ? 'अवधि' : 'Duration',
    filterAll: isNepali ? 'सबै' : 'All',
    filterCompleted: isNepali ? 'सम्पन्न' : 'Completed',
    filterOngoing: isNepali ? 'जारी' : 'Ongoing',
    filterFollowup: isNepali ? 'फलो-अप आवश्यक' : 'Follow-up Required',
    downloadReport: isNepali ? 'रिपोर्ट डाउनलोड गर्नुहोस्' : 'Download Report',
    years: isNepali ? 'वर्ष' : 'years',
  });

  const labels = getLabels();

  // Status and Priority badges
  const getStatusBadge = (status: MedicalRecord['status']) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        label: isNepali ? 'सम्पन्न' : 'Completed',
        variant: 'default' as const,
        className:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      ongoing: {
        icon: Activity,
        label: isNepali ? 'जारी' : 'Ongoing',
        variant: 'secondary' as const,
        className:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      followup_required: {
        icon: AlertTriangle,
        label: isNepali ? 'फलो-अप आवश्यक' : 'Follow-up Required',
        variant: 'destructive' as const,
        className:
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: MedicalRecord['priority']) => {
    const priorityConfig = {
      low: {
        label: isNepali ? 'कम' : 'Low',
        className:
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      },
      medium: {
        label: isNepali ? 'मध्यम' : 'Medium',
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      },
      high: {
        label: isNepali ? 'उच्च' : 'High',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      },
      critical: {
        label: isNepali ? 'अति गम्भीर' : 'Critical',
        className:
          'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100 animate-pulse',
      },
    };

    const config = priorityConfig[priority];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Filter records
  const filteredRecords = medicalRecords.filter(
    (record) => selectedFilter === 'all' || record.status === selectedFilter,
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold">{labels.title}</h1>
          <p className="text-muted-foreground mt-1">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {labels.downloadReport}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <div className="flex flex-wrap gap-2">
              {(
                ['all', 'completed', 'ongoing', 'followup_required'] as const
              ).map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="text-sm"
                >
                  {filter === 'all' && labels.filterAll}
                  {filter === 'completed' && labels.filterCompleted}
                  {filter === 'ongoing' && labels.filterOngoing}
                  {filter === 'followup_required' && labels.filterFollowup}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Records */}
      <div className="space-y-6">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="w-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">
                      {record.patientName[isNepali ? 'np' : 'en']}
                    </CardTitle>
                    <div className="flex gap-2">
                      {getStatusBadge(record.status)}
                      {getPriorityBadge(record.priority)}
                    </div>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {record.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {record.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {record.age} {labels.years} •{' '}
                      {record.gender[isNepali ? 'np' : 'en']}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Patient Basic Info & Diagnosis */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Stethoscope className="text-primary h-5 w-5" />
                    {labels.diagnosis}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground font-medium">
                      {record.diagnosis[isNepali ? 'np' : 'en']}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="text-primary h-5 w-5" />
                    {labels.symptoms}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-1">
                      {record.symptoms[isNepali ? 'np' : 'en'].map(
                        (symptom, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                            {symptom}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vital Signs */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Activity className="text-primary h-5 w-5" />
                  {labels.vitals}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Heart className="mx-auto mb-2 h-6 w-6 text-red-500" />
                    <div className="text-muted-foreground text-sm">
                      {labels.bloodPressure}
                    </div>
                    <div className="font-semibold">
                      {record.vitals.bloodPressure}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Thermometer className="mx-auto mb-2 h-6 w-6 text-orange-500" />
                    <div className="text-muted-foreground text-sm">
                      {labels.temperature}
                    </div>
                    <div className="font-semibold">
                      {record.vitals.temperature}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Activity className="mx-auto mb-2 h-6 w-6 text-green-500" />
                    <div className="text-muted-foreground text-sm">
                      {labels.heartRate}
                    </div>
                    <div className="font-semibold">
                      {record.vitals.heartRate}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Weight className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                    <div className="text-muted-foreground text-sm">
                      {labels.weight}
                    </div>
                    <div className="font-semibold">{record.vitals.weight}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Treatment & Medications */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Stethoscope className="text-primary h-5 w-5" />
                    {labels.treatment}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">
                      {record.treatment[isNepali ? 'np' : 'en']}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Pill className="text-primary h-5 w-5" />
                    {labels.medications}
                  </div>
                  <div className="space-y-3">
                    {record.medications.map((med, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-3">
                        <div className="mb-1 text-sm font-medium">
                          {med.name[isNepali ? 'np' : 'en']} - {med.dosage}
                        </div>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div>
                            {labels.frequency}:{' '}
                            {med.frequency[isNepali ? 'np' : 'en']}
                          </div>
                          <div>
                            {labels.duration}:{' '}
                            {med.duration[isNepali ? 'np' : 'en']}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Provider Info & Notes */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">
                        {labels.doctor}:
                      </span>
                      <span className="text-sm">
                        {record.doctorName[isNepali ? 'np' : 'en']}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">
                        {labels.healthPost}:
                      </span>
                      <span className="text-sm">
                        {record.healthPost[isNepali ? 'np' : 'en']}
                      </span>
                    </div>
                    {record.nextAppointment && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">
                          {labels.nextAppointment}:
                        </span>
                        <span className="text-primary text-sm font-semibold">
                          {record.nextAppointment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="text-primary h-5 w-5" />
                    {labels.notes}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">
                      {record.notes[isNepali ? 'np' : 'en']}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>
                {isNepali
                  ? 'कुनै चिकित्सा रेकर्ड फेला परेन।'
                  : 'No medical records found.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
