'use client';

import React from 'react';
import Image from 'next/image';
import { useUserStore } from '@/zustand/useUserStore';
import { cn, renderFullName } from '@/lib/utils';
import { TPatientData } from '@/types/healthpost.types';
import { poppins } from '@/constants/fonts';

export const PatientHealthCard = React.forwardRef<
  HTMLDivElement,
  TPatientData & {
    htmlElementId: string;
  }
>((data, ref) => {
  const { healthPostInfo } = useUserStore();

  const renderGridRow = (label: string, value: string) => (
    <div className="flex items-center gap-2 border-r border-b p-2 last:border-r-0">
      <span className="min-w-[80px] font-medium text-gray-600">{label}:</span>
      <span className="flex-1 text-gray-800">{value}</span>
    </div>
  );

  const renderVitalRow = (label: string, value: string) => (
    <div className="flex flex-col items-start border-r last:border-r-0">
      <span className="w-full border-b-1 p-2 font-medium text-gray-600">
        {label}
      </span>
      <span className="flex h-full items-center justify-center p-2 text-sm text-gray-800">
        {value}
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        `mt-2 flex h-fit flex-col items-center p-3`,
        poppins.className,
        poppins.variable,
      )}
      id={data.htmlElementId}
      ref={ref}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Header Section for Logo and Center Info */}
        <div className="flex w-full items-center justify-between p-1 px-4">
          <Image
            src={
              typeof healthPostInfo?.images?.[0] === 'string'
                ? healthPostInfo?.images[0]
                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Emblem_of_Nepal.svg/250px-Emblem_of_Nepal.svg.png'
            }
            alt="Medical Center Logo"
            width={72}
            height={72}
            className="h-28 w-28 object-fill"
          />
          <div className="text-center text-lg font-semibold text-gray-800">
            {healthPostInfo?.name}
            <div className="text-sm font-medium text-gray-800">
              <p className="text-gray-800">
                {healthPostInfo?.municipality}-{healthPostInfo?.wardNo},{' '}
                {healthPostInfo?.location}
              </p>
              <p className="text-gray-800">Phone: {healthPostInfo?.phone}</p>
              <p>Email: {healthPostInfo?.email}</p>
            </div>
          </div>
          <Image
            src="https://play-lh.googleusercontent.com/Byl6BHzEv7tWDGa5QUgztneq8C8TGYelu8ywVMTTRUH2e9keboyLqL4YhmzaU3vjgA=w240-h480-rw"
            alt="Medical Center Logo"
            width={72}
            height={72}
            className="h-28 w-28 object-fill"
          />
        </div>

        <fieldset className="m-1 space-y-6 rounded-sm border-t-2 border-gray-200 p-4 text-sm">
          <legend className="col-span-2 mb-2 text-center text-lg font-semibold text-gray-800">
            स्वास्थ्य सेवा कार्ड
          </legend>
          {/* Patient Information Grid */}
          <div className="grid grid-cols-3 border border-gray-200">
            {renderGridRow('नाम थर', data.name)}
            {renderGridRow('सेवाग्राही कोड', data.serviceCode)}
            {renderGridRow('मिति', data.date)}
            {renderGridRow('ओ.पि.डि न', data.opdNo)}
            {renderGridRow('ठेगाना, जिल्ला', data.address)}
            {renderGridRow('म.न.पा./गा.पा.', data.municipality)}
            {renderGridRow('वडा', data.ward)}
            {renderGridRow('लिङ्ग', data.gender)}
            {renderGridRow('उमेर', data.age)}
            {renderGridRow('सम्पर्क न', data.contactNo)}
          </div>

          {/* Vital Signs Section */}
          <div className="border border-gray-200">
            <div className="grid grid-cols-8 border-b">
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
          <fieldset className="grid min-h-40 grid-cols-2 rounded-sm border-2 border-gray-200 px-2">
            <legend className="col-span-2 mb-2 ml-4 text-sm font-semibold text-gray-800">
              सिकायत र निदान
            </legend>
            <div className="border-r p-2 pt-0">
              <div className="space-y-2">
                <p className="font-semibold text-gray-700 underline">
                  Complaints/History
                </p>

                <span
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: data.complaints,
                  }}
                ></span>

                <p className="mt-2 font-semibold text-gray-700 underline">
                  Observed/Examination
                </p>
                <span
                  dangerouslySetInnerHTML={{
                    __html: data.observedExamination || 'N/A',
                  }}
                ></span>
              </div>
            </div>
            <div className="space-y-2 pl-2">
              <h3 className="mb-2 font-semibold text-gray-700 underline">
                Diagnosis
              </h3>
              <span
                className="text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: data.diagnosis || 'N/A',
                }}
              ></span>
            </div>
          </fieldset>
          <fieldset className="grid min-h-40 grid-cols-2 rounded-sm border-2 border-gray-200 px-2">
            <legend className="col-span-2 mb-2 ml-4 text-sm font-semibold text-gray-800">
              उपचार र सल्लाह
            </legend>
            <div className="border-r p-2 pt-0">
              <div className="space-y-2">
                <p className="font-semibold text-gray-700 underline">
                  Treatment
                </p>

                <span
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: data.treatment || 'N/A',
                  }}
                ></span>
              </div>
            </div>
            <div className="space-y-2 pl-2">
              <h3 className="mb-2 font-semibold text-gray-700 underline">
                Advice/Notes
              </h3>
              <span
                className="text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: data.advice || 'N/A',
                }}
              ></span>
            </div>
          </fieldset>
          {/* Footer Section */}
          <div className="w-full pt-4 text-xs text-gray-600">
            <div className="flex flex-col items-end">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={
                    data.user?.profileImage?.[0] ||
                    'https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg'
                  }
                  alt={data.user.fullName?.firstName + 's signature'}
                  width={64}
                  height={44}
                  className="mb-1 object-cover"
                />
                <p className="border-t-1 border-dashed border-gray-500 pt-3">
                  {renderFullName({
                    params: data.user.fullName,
                  })}
                </p>
                <p className="my-1">Examinier</p>
              </div>
            </div>
            <p className="text-center">
              हरेक पटक आउदा यो पुर्जा अनिवार्य रुपमा लिइ आउनु होला ।
            </p>
          </div>
        </fieldset>
      </div>
    </div>
  );
});

PatientHealthCard.displayName = 'PatientHealthCard';
