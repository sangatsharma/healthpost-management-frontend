'use client';
import { PatientHealthCard } from '@/components/reusables/PatientHealthCard.tsx';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useReactToPrint } from 'react-to-print';

export default function OpdRegister() {
  const data = {
    date: '2082-03-27',
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
      respiration: '-',
      weight: '-',
      height: '-',
      bpm: '-',
      mucus: '-',
    },
    complaints:
      'toothache, weakness,Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos,Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos',
    diagnosis:
      'Dental caries Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos',
    observedExamination:
      ' <p><img class="rounded-lg max-w-full h-auto" src="https://dermindy.com/wp-content/uploads/2019/02/wound.jpg" data-align="left"></p><ul><li><p><span style="color: oklch(0.278 0.033 256.848); font-family: Poppins, &quot;Poppins Fallback&quot;, &quot;Noto Sans Devanagari&quot;, system-ui, sans-serif; font-size: 14px">toothache, weakness]</span></p></li><li><p><span style="color: oklch(0.278 0.033 256.848); font-family: Poppins, &quot;Poppins Fallback&quot;, &quot;Noto Sans Devanagari&quot;, system-ui, sans-serif; font-size: 14px">,Bufren 400mg 10 tds for 3 days Ranitidine</span></p></li><li><p><span style="color: oklch(0.278 0.033 256.848); font-family: Poppins, &quot;Poppins Fallback&quot;, &quot;Noto Sans Devanagari&quot;, system-ui, sans-serif; font-size: 14px"> 150mg 10 1tab od for 10 daysors 2 pkts sos,Bufren 400mg </span></p></li><li><p><span style="color: oklch(0.278 0.033 256.848); font-family: Poppins, &quot;Poppins Fallback&quot;, &quot;Noto Sans Devanagari&quot;, system-ui, sans-serif; font-size: 14px">10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos</span><br></p></li></ul>',
    advice:
      'Maintain oral hygiene, regular dental check-ups Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos',
    treatment:
      'Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos Bufren 400mg 10 tds for 3 days Ranitidine 150mg 10 1tab od for 10 daysors 2 pkts sos',

    user: {
      fullName: {
        firstName: 'Dr. Ram',
        middleName: 'Kumar',
        lastName: 'Shrestha',
      },
    },
  };
  const healthCardRef = React.useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    documentTitle: data.name + `'s Health Card`,
    contentRef: healthCardRef,
  });

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="flex justify-end gap-2">
        <Button
          variant="default"
          onClick={() => {
            print();
          }}
        >
          Print
        </Button>
      </div>
      <PatientHealthCard
        {...data}
        htmlElementId="patient-health-card"
        ref={healthCardRef}
      />
    </div>
  );
}
