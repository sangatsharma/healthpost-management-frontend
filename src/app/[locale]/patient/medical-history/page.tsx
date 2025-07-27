'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  FileText,
  User,
  Download,
  Search,
  Filter,
  Eye,
  Stethoscope,
  TestTube,
  Pill,
} from 'lucide-react';

export default function MedicalHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock medical history data
  const medicalHistory = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'routine',
      doctor: 'Dr. Sharma',
      department: 'General Medicine',
      chiefComplaint: 'Routine checkup',
      diagnosis: 'Hypertension, well controlled',
      prescription: 'Amlodipine 5mg OD',
      labResults: ['BP: 130/85', 'Blood Sugar: 95mg/dl'],
      followUp: '2024-04-15',
      documents: ['prescription.pdf', 'lab_report.pdf'],
    },
    {
      id: 2,
      date: '2024-01-08',
      type: 'anc',
      doctor: 'Dr. Patel',
      department: 'Obstetrics & Gynecology',
      chiefComplaint: 'ANC Visit - 24 weeks',
      diagnosis: 'Normal pregnancy progression',
      prescription: 'Iron + Folic acid, Calcium',
      labResults: ['Hemoglobin: 11.2g/dl', 'Urine: Normal'],
      followUp: '2024-02-05',
      documents: ['anc_card.pdf', 'ultrasound.pdf'],
    },
    {
      id: 3,
      date: '2023-12-20',
      type: 'referral',
      doctor: 'Dr. Thapa',
      department: 'Cardiology',
      chiefComplaint: 'Chest pain evaluation',
      diagnosis: 'Non-cardiac chest pain',
      prescription: 'Antacid, lifestyle modification',
      labResults: ['ECG: Normal', 'Echo: Normal'],
      followUp: '2024-03-20',
      documents: ['ecg_report.pdf', 'echo_report.pdf'],
    },
    {
      id: 4,
      date: '2023-11-15',
      type: 'emergency',
      doctor: 'Dr. Rai',
      department: 'Emergency Medicine',
      chiefComplaint: 'Severe headache',
      diagnosis: 'Migraine',
      prescription: 'Sumatriptan, rest',
      labResults: ['CT Scan: Normal'],
      followUp: '2023-12-15',
      documents: ['ct_report.pdf', 'discharge_summary.pdf'],
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine':
        return 'bg-blue-100 text-blue-800';
      case 'anc':
        return 'bg-pink-100 text-pink-800';
      case 'referral':
        return 'bg-purple-100 text-purple-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'routine':
        return <Stethoscope className="h-4 w-4" />;
      case 'anc':
        return <User className="h-4 w-4" />;
      case 'referral':
        return <FileText className="h-4 w-4" />;
      case 'emergency':
        return <TestTube className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredHistory = medicalHistory.filter((record) => {
    const matchesSearch =
      record.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    const matchesYear = record.date.startsWith(selectedYear);

    return matchesSearch && matchesFilter && matchesYear;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl font-bold">Medical History</h1>
        <p className="text-muted-foreground">
          Complete record of your medical consultations and treatments
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search by complaint, doctor, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="anc">ANC Visit</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medical Records */}
      <div className="space-y-4">
        {filteredHistory.map((record) => (
          <Card key={record.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{record.date}</span>
                  </div>
                  <Badge className={getTypeColor(record.type)}>
                    {getTypeIcon(record.type)}
                    <span className="ml-1 capitalize">{record.type}</span>
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="prescription">Prescription</TabsTrigger>
                  <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-gray-600">
                        Doctor & Department
                      </h4>
                      <p className="font-medium">{record.doctor}</p>
                      <p className="text-sm text-gray-600">
                        {record.department}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-gray-600">
                        Follow-up Date
                      </h4>
                      <p className="font-medium">{record.followUp}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-600">
                      Chief Complaint
                    </h4>
                    <p>{record.chiefComplaint}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-600">
                      Diagnosis
                    </h4>
                    <p>{record.diagnosis}</p>
                  </div>
                </TabsContent>

                <TabsContent value="prescription" className="mt-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Prescribed Medications</h4>
                    </div>
                    <p>{record.prescription}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 bg-transparent"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Prescription
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="lab-results" className="mt-4">
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Laboratory Results</h4>
                    </div>
                    <div className="space-y-2">
                      {record.labResults.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded border bg-white p-2"
                        >
                          <span>{result}</span>
                          <Badge variant="outline">Normal</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h4 className="font-semibold">Medical Documents</h4>
                    </div>
                    <div className="space-y-2">
                      {record.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded border bg-white p-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span>{doc}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {medicalHistory.filter((r) => r.type === 'routine').length}
              </div>
              <div className="text-sm text-gray-600">Routine Visits</div>
            </div>
            <div className="rounded-lg bg-pink-50 p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">
                {medicalHistory.filter((r) => r.type === 'anc').length}
              </div>
              <div className="text-sm text-gray-600">ANC Visits</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {medicalHistory.filter((r) => r.type === 'referral').length}
              </div>
              <div className="text-sm text-gray-600">Referrals</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {medicalHistory.filter((r) => r.type === 'emergency').length}
              </div>
              <div className="text-sm text-gray-600">Emergency Visits</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
