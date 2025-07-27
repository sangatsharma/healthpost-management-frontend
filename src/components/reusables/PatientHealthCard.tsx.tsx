'use client';

import React from 'react';
import Image from 'next/image';
import {
  cleanNepaliDate,
  cn,
  renderFullName,
  replaceWithNepali,
} from '@/lib/utils';
import { poppins } from '@/constants/fonts';
import { TOpd, TUser } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { fetchHealthPostInfo, fetchStaffInfo } from '@/api/queries';
import { THealthPost } from '@/types/healthpost.types';
import { differenceInYears } from 'date-fns';
import { BSToAD } from 'bikram-sambat-js';
import FetchWrapper from './fetch-wrapper';
import Loading from '../ui/loading';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useLocale } from 'use-intl';
import QRCode from 'react-qr-code';

export const PatientHealthCard = React.forwardRef<
  HTMLDivElement,
  TOpd & {
    htmlElementId: string;
  }
>((data, ref) => {
  const t = useTypedTranslations('OpdSection');
  const tt = useTypedTranslations('AlertDialog');
  const ttt = useTypedTranslations('MedicalHistory');
  const tenum = useTypedTranslations('Enums');
  const locale = useLocale();

  const { data: response, ...rest } = useQuery({
    queryKey: queryKeys.healthPost.singleHealthPost(data.healthPostId || ''),
    queryFn: () =>
      fetchHealthPostInfo({
        healthPostId: data.healthPostId!,
      }),
    enabled: !!data.healthPostId,
  });
  const healthPostInfo = response?.data as THealthPost;

  const { data: staffResponse, ...staffRest } = useQuery({
    queryKey: queryKeys.staff.singleStaff(data.examinerId || ''),
    queryFn: () =>
      fetchStaffInfo({
        staffId: data.examinerId!,
      }),
    enabled: !!data.examinerId,
  });
  const staffInfo = staffResponse?.data as TUser;

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

  if (staffRest.isLoading) {
    return <Loading />;
  }

  let differenceDate;
  try {
    if (data.patient.dobBs) {
      differenceDate = differenceInYears(
        Date.now(),
        cleanNepaliDate(BSToAD(data.patient.dobBs)),
      );
    }
  } catch (_error) {
    differenceDate = '-';
  }

  return (
    <FetchWrapper {...rest}>
      <div
        className={cn(
          `mt-2 flex h-fit flex-col items-center p-3`,
          poppins.className,
          poppins.variable,
        )}
        id={data.htmlElementId}
        ref={ref}
      >
        <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white pt-3 shadow-lg">
          <div className="flex w-full items-center justify-between p-1 px-4">
            <Image
              src={
                typeof healthPostInfo?.images?.[0] === 'string'
                  ? healthPostInfo?.images?.[0]
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
            {/* <Image
              src="https://play-lh.googleusercontent.com/Byl6BHzEv7tWDGa5QUgztneq8C8TGYelu8ywVMTTRUH2e9keboyLqL4YhmzaU3vjgA=w240-h480-rw"
              alt="Medical Center Logo"
              width={72}
              height={72}
              className="h-28 w-28 object-fill"
            /> */}
            <div className="border-[8px] !border-[#009788] p-1">
              <QRCode
                value={`https://www.healthsync.me/${locale}/report?reportId=${data.id}&reportType=opd&patientId=${data.patientId}`}
                size={72}
                bgColor="#ffffff"
                fgColor="#000000"
                className="h-28 w-28 object-fill"
                title="Patient QR Code"
              />
            </div>
          </div>

          <fieldset className="m-1 space-y-6 rounded-sm border-t-2 border-gray-200 p-4 text-sm">
            <legend className="col-span-2 mb-2 text-center text-lg font-semibold text-gray-800">
              {t('ticketDetails.title')}
            </legend>
            {/* Patient Information Grid */}
            <div className="grid grid-cols-3 border border-gray-200">
              {renderGridRow(
                t('ticketDetails.patientName'),
                renderFullName({ params: data.patient }),
              )}
              {renderGridRow(
                t('ticketDetails.patientCode'),
                data.patient.patientCode || 'N/A',
              )}
              {renderGridRow(
                t('ticketDetails.date'),
                cleanNepaliDate(data.visitedDate) || 'N/A',
              )}
              {renderGridRow(t('ticketDetails.opdNo'), data.opdNo || 'N/A')}
              {renderGridRow(
                t('ticketDetails.nationality'),
                data.patient.nationality || 'N/A',
              )}
              {renderGridRow(
                t('ticketDetails.district'),
                (data.patient.districtId || 'N/A') +
                  (data.patient.tole || 'N/A'),
              )}
              {renderGridRow(
                t('ticketDetails.municipality'),
                data.patient.palityId || 'N/A',
              )}
              {renderGridRow(
                t('ticketDetails.wardNo'),
                data.patient.wardNo || 'N/A',
              )}
              {renderGridRow(
                t('ticketDetails.gender'),
                data.patient.gender || 'N/A',
              )}
              {renderGridRow(
                t('ticketDetails.age'),
                `${differenceDate || 'N/A'}`,
              )}
              {renderGridRow(
                t('ticketDetails.contactNo'),
                data.patient.phoneNumber ||
                  data.patient.emergencyContact ||
                  'N/A',
              )}
              {renderGridRow(
                t('visitType'),
                tenum(`visitType.${data.visitType}`) || 'N/A',
              )}
              {renderGridRow(
                t('treatmentType'),
                tenum(`treatmentType.${data.treatementType}`) || 'N/A',
              )}
              {renderGridRow(
                t('ticketDetails.followUp'),
                data.followUpRequired ? tt('action.yes') : tt('action.no'),
              )}
              {renderGridRow(
                t('followUpDate'),
                data.followUpDate ? cleanNepaliDate(data.followUpDate) : '-',
              )}
            </div>

            {/* Vital Signs Section */}
            <div className="border border-gray-200">
              <div className="grid grid-cols-7 border-b">
                {renderVitalRow(t('bp'), (data.vitals?.bp || 'N/A') + ' mmHg')}
                {renderVitalRow(
                  t('pulse'),
                  (data.vitals?.pulse || 'N/A') + ' bpm',
                )}
                {renderVitalRow(
                  t('temperature'),
                  (data.vitals?.temperature || 'N/A') + ' °F',
                )}
                {renderVitalRow(
                  t('respiration'),
                  (data.vitals?.respiration || 'N/A') + ' rpm',
                )}
                {renderVitalRow(
                  t('weight'),
                  (data.vitals?.weight || 'N/A') + ' kg',
                )}
                {renderVitalRow(
                  t('height'),
                  (data.vitals?.height || 'N/A') + ' cm',
                )}
                {renderVitalRow(t('mucus'), data.vitals?.mucus || 'N/A')}
              </div>
            </div>

            {/* Complaints, Diagnosis, Treatment Section */}
            <fieldset className="grid min-h-40 grid-cols-2 rounded-sm border-2 border-gray-200 px-2">
              <legend className="col-span-2 mb-2 ml-4 text-sm font-semibold text-gray-800">
                {t('ticketDetails.complaintsDiagnosis')}
              </legend>
              <div className="border-r p-2 pt-0">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 underline">
                    {t('ticketDetails.complaintsHistory')}
                  </p>

                  <span
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: data?.complaints || '',
                    }}
                  ></span>

                  <p className="mt-2 font-semibold text-gray-700 underline">
                    {t('ticketDetails.observedExamination')}
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
                  {t('ticketDetails.diagnosis')}
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
                {t('ticketDetails.treatmentAdvice')}
              </legend>
              <div className="border-r p-2 pt-0">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 underline">
                    {t('ticketDetails.treatment')}
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
                  {t('ticketDetails.medicines')}
                </h3>
                <span className="flex flex-col text-xs text-gray-800">
                  {data.prescriptions?.map((prescription, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-semibold">
                        {prescription.name} : {prescription.quantity}
                      </p>
                      <div className="grid grid-cols-2">
                        <p>
                          {ttt('dosage')}: {prescription.dosage}
                        </p>
                        <p>
                          {t('duration')}: {prescription.duration}
                        </p>
                        <p>
                          {ttt('frequency')}:{' '}
                          {tenum(`frequency.${prescription.frequency}`)}
                        </p>
                        <p>
                          {t('intakeTime')}:{' '}
                          {locale === 'np'
                            ? replaceWithNepali(prescription.intakeTime)
                            : prescription.intakeTime.toLowerCase()}
                        </p>
                        <p>
                          {t('intakeRoute')}:{' '}
                          {tenum(`intakeRoute.${prescription.intakeRoute}`)}
                        </p>
                        <p>
                          {t('timing')}:{' '}
                          {tenum(`timing.${prescription.timing}`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </span>
              </div>
            </fieldset>
            {/* Footer Section */}
            <div className="w-full pt-4 text-xs text-gray-600">
              <div className="flex flex-col items-end">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src={
                      staffInfo?.signature?.[0] ||
                      'https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg'
                    }
                    alt={staffInfo?.fullName?.firstName + 's signature'}
                    width={64}
                    height={44}
                    className="mb-1 object-cover"
                  />
                  <p className="border-t-1 border-dashed border-gray-500 pt-3">
                    {renderFullName({
                      params: staffInfo?.fullName,
                    })}
                  </p>

                  <p className="my-1">
                    {tenum(`userRole.${staffInfo?.role}`) ||
                      t('ticketDetails.examinier')}
                  </p>
                </div>
              </div>
              <p className="text-center">{t('ticketDetails.reminder')}</p>
            </div>
          </fieldset>
        </div>
      </div>
    </FetchWrapper>
  );
});

PatientHealthCard.displayName = 'PatientHealthCard';
