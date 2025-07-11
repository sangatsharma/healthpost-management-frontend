'use client';

import { useRef } from 'react';
import Image from 'next/image';
import PrintDirectButton from './print-direct-button';
import DownloadPdfButton from './download-pdf-button';

interface PatientData {
  date: string;
  insuranceNo: string;
  registrationNo: string;
  claimCode: string;
  serviceCode: string;
  opdNo: string;
  name: string;
  age: string;
  address: string;
  municipality: string;
  ward: string;
  gender: string;
  contactNo: string;
  vitals: {
    bp: string;
    pulse: string;
    temperature: string;
    respiration: string;
    weight: string;
    height: string;
    bpm: string;
    mucus: string;
  };
  complaints: string[];
  diagnosis: string[];
  treatment: string[];
  user: string;
}

const data: PatientData = {
  date: '2082-03-27',
  insuranceNo: 'N/A',
  registrationNo: '10',
  claimCode: 'N/A',
  serviceCode: 'POK282081-82-0341',
  opdNo: '10',
  name: 'Maiya Sunar',
  age: '67 Y',
  address: 'Sudartole, Kaski',
  municipality: 'Pokhara',
  ward: '28',
  gender: 'Female',
  contactNo: 'N/A',
  vitals: {
    bp: '99/49 mm of Hg',
    pulse: '/bpm',
    temperature: '97.6 °F',
    respiration: '/m',
    weight: '-',
    height: '-',
    bpm: '-',
    mucus: '-',
  },
  complaints: ['toothache', 'weakness'],
  diagnosis: ['Dental caries'],
  treatment: [
    'Bufren 400mg 10 tds for 3 days',
    'Ranitidine 150mg 10',
    '1tab od for 10 days',
    'ors 2 pkts',
    'sos',
  ],
  user: 'Sanju Sharma - ID 130',
};

export default function PatientHealthCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const renderGridRow = (label: string, value: string) => (
    <div className="flex items-center border-r border-b p-2 last:border-r-0 print:border-gray-300">
      <span className="min-w-[80px] font-medium text-gray-600 print:text-gray-700">
        {label}:
      </span>
      <span className="flex-1 text-gray-800 print:text-gray-900">{value}</span>
    </div>
  );

  const renderVitalRow = (label: string, value: string) => (
    <div className="flex flex-col items-start border-r p-2 last:border-r-0 print:border-gray-300">
      <span className="font-medium text-gray-600 print:text-gray-700">
        {label}
      </span>
      <span className="text-gray-800 print:text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4 print:min-h-0 print:bg-white print:p-0">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg print:w-auto print:max-w-none print:rounded-none print:border print:border-gray-300 print:shadow-none">
        {/* Header Section for Logo and Center Info */}
        <div className="flex items-center justify-between border-b p-4 print:border-gray-300">
          <div className="flex items-center gap-4">
            <Image
              src="/placeholder.svg?height=60&width=60"
              alt="Medical Center Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <div className="text-lg font-semibold text-gray-800 print:text-gray-900">
              Medical Center Name
              <div className="text-sm font-normal text-gray-600 print:text-gray-700">
                Your Health, Our Priority
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600 print:text-gray-700">
            <p>123 Health St, City, Country</p>
            <p>Phone: +123 456 7890</p>
            <p>Email: info@medicalcenter.com</p>
          </div>
        </div>

        <div
          ref={cardRef}
          className="space-y-6 p-6 text-sm print:space-y-0 print:p-0"
        >
          {/* Patient Information Grid */}
          <div className="grid grid-cols-3 border border-gray-200 print:border-gray-300">
            {renderGridRow('मिति', data.date)}
            {renderGridRow('विमा न', data.insuranceNo)}
            {renderGridRow('सेवाग्राही कोड', data.serviceCode)}
            {renderGridRow('मूल दर्ता न', data.registrationNo)}
            {renderGridRow('क्लेम कोड', data.claimCode)}
            {renderGridRow('ओ.पि.डि न', data.opdNo)}
            {renderGridRow('ठेगाना, जिल्ला', data.address)}
            {renderGridRow('म.न.पा./गा.पा.', data.municipality)}
            {renderGridRow('वडा', data.ward)}
            {renderGridRow('नाम थर', data.name)}
            {renderGridRow('लिङ्ग', data.gender)}
            {renderGridRow('उमेर', data.age)}
            {renderGridRow('सम्पर्क न', data.contactNo)}
          </div>

          {/* Vital Signs Section */}
          <div className="border border-gray-200 print:border-gray-300">
            <div className="grid grid-cols-8 border-b print:border-gray-300">
              {renderVitalRow('BP', data.vitals.bp)}
              {renderVitalRow('Pulse', data.vitals.pulse)}
              {renderVitalRow('Temperature', data.vitals.temperature)}
              {renderVitalRow('Respiration', data.vitals.respiration)}
              {renderVitalRow('Weight', data.vitals.weight)}
              {renderVitalRow('Height', data.vitals.height)}
              {renderVitalRow('BPM', data.vitals.bpm)}
              {renderVitalRow('Mucus', data.vitals.mucus)}
            </div>
          </div>

          {/* Complaints, Diagnosis, Treatment Section */}
          <div className="grid grid-cols-2 border border-gray-200 print:border-gray-300">
            <div className="border-r p-4 print:border-gray-300">
              <h3 className="mb-2 font-semibold text-gray-700 print:text-gray-800">
                सिकायत र निदान
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-700 print:text-gray-800">
                  C/O
                </p>
                <ul className="list-none space-y-1 pl-0 text-gray-800 print:text-gray-900">
                  {data.complaints.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="font-medium text-gray-700 print:text-gray-800">
                  O/E
                </p>
                <p className="text-gray-800 print:text-gray-900">N/A</p>
                <p className="font-medium text-gray-700 print:text-gray-800">
                  DIAGNOSIS
                </p>
                <ul className="list-inside list-disc space-y-1 pl-0 text-gray-800 print:text-gray-900">
                  {data.diagnosis.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-semibold text-gray-700 print:text-gray-800">
                RX. & TREATMENT
              </h3>
              <ul className="list-none space-y-1 pl-0 text-gray-800 print:text-gray-900">
                {data.treatment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Section */}
          <div className="border-t border-gray-200 pt-4 text-xs text-gray-600 print:border-gray-300 print:text-gray-700">
            <p className="mb-2">User : {data.user}</p>
            <p className="text-center">
              हरेक पटक आउदा यो पुर्जा अनिवार्य रुपमा लिइ आउनु होला ।
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-4 print:hidden">
        <PrintDirectButton contentRef={cardRef} />
        <DownloadPdfButton
          contentRef={cardRef}
          fileName={`patient-card-${data.name.replace(/\s/g, '-')}.pdf`}
        />
      </div>
    </div>
  );
}
