'use client';
import type React from 'react';
import { ProtectedPatientRoute } from './_components/PatientPortalLayout';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedPatientRoute>{children}</ProtectedPatientRoute>;
}
