'use client';

import { fetchClientsInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Shield,
  Users,
  FileText,
  Eye,
  Building2,
  CreditCard,
  Activity,
  Home,
  Clock,
  Banknote,
  ArrowLeft,
} from 'lucide-react';
import FetchWrapper from './fetch-wrapper';
import { TClient } from '@/types/user.types';
import { cleanNepaliDate } from '@/lib/utils';
import { ImagePreviewer } from './ImagePreviewer';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

interface PatientProfilePageProps {
  view: 'patient' | 'healthpost';
  patientId: string;
}

export function PatientProfile({ view, patientId }: PatientProfilePageProps) {
  const router = useRouter();
  const t = useTypedTranslations('PatientProfile');
  const { data, ...rest } = useQuery({
    queryKey: [queryKeys.client.singleClient(patientId)],
    select: (data) => data?.data as TClient,
    queryFn: () =>
      fetchClientsInfo({
        clientId: patientId,
      }),
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white dark:from-emerald-600 dark:to-green-600';
      case 'INACTIVE':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white dark:from-red-600 dark:to-pink-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white dark:from-gray-500 dark:to-gray-600';
    }
  };

  const getBloodGroupColor = () => {
    return 'bg-gradient-to-r from-red-500 to-rose-500 text-white dark:from-red-600 dark:to-rose-600';
  };

  const PatientView = () => (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header Section */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-xl dark:border dark:border-slate-800 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="relative">
              <ImagePreviewer>
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg dark:border-slate-700">
                  <AvatarImage
                    src={
                      data?.profileImage?.[0] ||
                      'https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Clip-Art-PNG.png'
                    }
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl text-white dark:from-blue-600 dark:to-purple-600">
                    {t('userAvatar')}
                  </AvatarFallback>
                </Avatar>
              </ImagePreviewer>
              <div className="absolute -right-2 -bottom-2 rounded-full bg-green-500 p-2 dark:bg-green-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                  {data?.firstName} {data?.middleName} {data?.lastName}
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                  {t('patientCode')}: {data?.patientCode}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <Badge
                  className={`${getStatusColor(data?.status)} px-4 py-2 text-sm font-medium`}
                >
                  {data?.status}
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm text-white dark:from-blue-600 dark:to-cyan-600">
                  {data?.gender}
                </Badge>
                <Badge className={`${getBloodGroupColor()} px-4 py-2 text-sm`}>
                  {data?.bloodGroup.replace('_', ' ')}
                </Badge>
                {data?.isMinor && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm text-white dark:from-yellow-600 dark:to-orange-600">
                    {t('minor')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid h-14 w-full grid-cols-4 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <TabsTrigger
            value="personal"
            className="text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
          >
            {t('tabs.personal')}
          </TabsTrigger>
          <TabsTrigger
            value="medical"
            className="text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
          >
            {t('tabs.medical')}
          </TabsTrigger>
          <TabsTrigger
            value="address"
            className="text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
          >
            {t('tabs.address')}
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
          >
            {t('tabs.family')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-8 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg dark:border dark:border-slate-800 dark:from-orange-950 dark:to-yellow-950">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 p-2 dark:from-orange-600 dark:to-yellow-600">
                  <User className="h-6 w-6 text-white" />
                </div>
                {t('sections.personalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.dateOfBirthBS')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Calendar className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.dobBs}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.dateOfBirthAD')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Calendar className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.dobAd}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.age')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {10} {t('fields.years')}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.email')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-lg font-medium break-all dark:text-gray-200">
                      {data?.email}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.phone')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Phone className="h-5 w-5 text-green-500 dark:text-green-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.phoneNumber}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.nationality')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.nationality}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.citizenshipNumber')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.citizenshipNumber}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.nationalId')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.nationalId}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.casteType')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.casteType}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.role')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-white dark:from-purple-600 dark:to-indigo-600">
                      {data?.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.accountType')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.accountType}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="mt-8 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg dark:border dark:border-slate-800 dark:from-red-950 dark:to-pink-950">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-2 dark:from-red-600 dark:to-pink-600">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                {t('sections.medicalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.bloodGroup')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Activity className="h-5 w-5 text-red-500 dark:text-red-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.bloodGroup.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.height')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.height}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.weight')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.weight}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.disabilityType')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Eye className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.disabilityType}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.disabilityIdentityType')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.disabilityIdentityType}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.vaccinationStatus')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Badge
                      className={
                        data?.isVaccineCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-white dark:from-green-600 dark:to-emerald-600'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-white dark:from-red-600 dark:to-pink-600'
                      }
                    >
                      {data?.isVaccineCompleted
                        ? t('status.completed')
                        : t('status.incomplete')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.emergencyContact')}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Phone className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.emergencyContact}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.nshiNumber')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.nshiNumber || t('placeholders.notProvided')}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.sgcEligibility')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <Badge
                      className={
                        data?.isEligibleForSgc
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-white dark:from-blue-600 dark:to-indigo-600'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 px-4 py-2 text-white dark:from-gray-500 dark:to-gray-600'
                      }
                    >
                      {data?.isEligibleForSgc
                        ? t('status.eligible')
                        : t('status.notEligible')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="mt-8 space-y-8">
          <div className="grid gap-8">
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg dark:border dark:border-slate-800 dark:from-green-950 dark:to-emerald-950">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2 dark:from-green-600 dark:to-emerald-600">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  {t('sections.permanentAddress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.district')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.districtId}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.municipality')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.palityId}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.wardNo')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.wardNo}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.tole')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.tole}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg dark:border dark:border-slate-800 dark:from-blue-950 dark:to-cyan-950">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2 dark:from-blue-600 dark:to-cyan-600">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  {t('sections.temporaryAddress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.district')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.tDistrictId}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.municipality')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.tPalityId}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.wardNo')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.tWardNo}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                      {t('fields.tole')}
                    </label>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <span className="text-lg font-medium dark:text-gray-200">
                        {data?.tTole}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="family" className="mt-8 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg dark:border dark:border-slate-800 dark:from-purple-950 dark:to-indigo-950">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 p-2 dark:from-purple-600 dark:to-indigo-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                {t('sections.familyInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.fatherName')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.fatherName}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.motherName')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.motherName}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.guardianName')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.guardianName || t('placeholders.notSpecified')}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.spouseName')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.spouseName || t('placeholders.notSpecified')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg dark:border dark:border-slate-800 dark:from-yellow-950 dark:to-orange-950">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 p-2 dark:from-yellow-600 dark:to-orange-600">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                {t('sections.bankingInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.bank')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.bank}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                    {t('fields.bankBranch')}
                  </label>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <span className="text-lg font-medium dark:text-gray-200">
                      {data?.bankBranch}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const HealthPostView = () => (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card className="border-0 shadow-lg dark:border dark:border-slate-800 dark:from-indigo-950 dark:via-slate-900 dark:to-blue-950">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <ImagePreviewer>
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg dark:border-slate-700">
                  <AvatarImage
                    src={
                      data?.profileImage?.[0] ||
                      'https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Clip-Art-PNG.png'
                    }
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl text-white dark:from-blue-600 dark:to-purple-600">
                    {t('userAvatar')}
                  </AvatarFallback>
                </Avatar>
              </ImagePreviewer>
              <div className="absolute -right-1 -bottom-1 rounded-full bg-green-500 p-1 dark:bg-green-600">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-blue-400">
                {data?.firstName} {data?.middleName} {data?.lastName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                ID: {data?.patientCode}
              </p>
              <div className="mt-2 flex gap-3">
                <Badge className={`${getStatusColor(data?.status)} px-3 py-1`}>
                  {data?.status}
                </Badge>
                {data?.lockReport && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-white dark:from-red-600 dark:to-pink-600">
                    {t('status.reportLocked')}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-white hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600">
                <FileText className="mr-2 h-4 w-4" />
                {t('actions.viewReports')}
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-white hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600">
                <Shield className="mr-2 h-4 w-4" />
                {t('actions.updateRecord')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg dark:from-orange-600 dark:to-red-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100 dark:text-orange-200">
                  {t('quickStats.age')}
                </p>
                <p className="text-3xl font-bold">
                  {10} {t('fields.years')}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-orange-200 dark:text-orange-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg dark:from-red-600 dark:to-pink-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-100 dark:text-red-200">
                  {t('quickStats.bloodGroup')}
                </p>
                <p className="text-3xl font-bold">
                  {data?.bloodGroup.replace('_', ' ')}
                </p>
              </div>
              <Activity className="h-10 w-10 text-red-200 dark:text-red-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg dark:from-green-600 dark:to-emerald-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100 dark:text-green-200">
                  {t('quickStats.vaccination')}
                </p>
                <p className="text-3xl font-bold">
                  {data?.isVaccineCompleted ? '✓' : '✗'}
                </p>
              </div>
              <Shield className="h-10 w-10 text-green-200 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg dark:from-blue-600 dark:to-indigo-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100 dark:text-blue-200">
                  {t('quickStats.sgcEligible')}
                </p>
                <p className="text-3xl font-bold">
                  {data?.isEligibleForSgc
                    ? t('quickStats.yes')
                    : t('quickStats.no')}
                </p>
              </div>
              <CreditCard className="h-10 w-10 text-blue-200 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Administrative Details */}
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg dark:border dark:border-slate-800 dark:from-purple-950 dark:to-indigo-950">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 p-2 dark:from-purple-600 dark:to-indigo-600">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {t('sections.administrativeDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.patientCodeShort')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.patientCode}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.accountType')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.accountType}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.casteType')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.casteType}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.citizenship')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.citizenshipNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.nationalId')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.nationalId}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.minorStatus')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <Badge
                    className={
                      data?.isMinor
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white dark:from-yellow-600 dark:to-orange-600'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white dark:from-gray-500 dark:to-gray-600'
                    }
                  >
                    {data?.isMinor ? t('minor') : t('adult')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Summary */}
        <Card className="border-0 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg dark:border dark:border-slate-800 dark:from-red-950 dark:to-pink-950">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-2 dark:from-red-600 dark:to-pink-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              {t('sections.medicalSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.bloodGroup')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.bloodGroup.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.height')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.height}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.weight')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.weight}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.disability')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.disabilityType}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.emergencyContact')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.emergencyContact}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.nshiNumber')}
                </span>
                <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.nshiNumber || t('placeholders.notProvided')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg dark:border dark:border-slate-800 dark:from-green-950 dark:to-emerald-950">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2 dark:from-green-600 dark:to-emerald-600">
                <Phone className="h-5 w-5 text-white" />
              </div>
              {t('sections.contactInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.email')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium break-all dark:text-gray-200">
                    {data?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.phone')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.permanentAddressShort')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.tole}, Ward {data?.wardNo}, {data?.palityId}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banking & Family Information */}
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg dark:border dark:border-slate-800 dark:from-blue-950 dark:to-cyan-950">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2 dark:from-blue-600 dark:to-cyan-600">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              {t('sections.bankingAndFamily')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.bank')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">{data?.bank}</p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.branch')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.bankBranch}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.father')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.fatherName}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                  {t('fields.mother')}
                </span>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="font-medium dark:text-gray-200">
                    {data?.motherName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record History */}
      <Card className="border-0 bg-gradient-to-br from-gray-50 to-slate-50 shadow-lg dark:border dark:border-slate-800 dark:from-gray-950 dark:to-slate-950">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="rounded-lg bg-gradient-to-r from-gray-600 to-slate-600 p-2 dark:from-gray-500 dark:to-slate-500">
              <FileText className="h-5 w-5 text-white" />
            </div>
            {t('sections.recordInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                {t('fields.created')}
              </span>
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                <p className="font-medium dark:text-gray-200">
                  {cleanNepaliDate(data?.createdAt)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                {t('fields.lastUpdated')}
              </span>
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                <p className="font-medium dark:text-gray-200">
                  {cleanNepaliDate(data?.updatedAt)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                {t('fields.reportStatus')}
              </span>
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                <Badge
                  className={
                    data?.lockReport
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-white dark:from-red-600 dark:to-pink-600'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-white dark:from-green-600 dark:to-emerald-600'
                  }
                >
                  {data?.lockReport ? t('status.locked') : t('status.unlocked')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <FetchWrapper {...rest}>
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 border-b border-white/20 bg-white/80 backdrop-blur-sm dark:border-slate-800/20 dark:bg-slate-900/80">
          <div className="mx-auto max-w-7xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (view === 'healthpost') {
                      router.replace('/hp/clients');
                    } else {
                      window.history.back();
                    }
                  }}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('backButton')}
                </Button>
                <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text pt-2 text-3xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
                  {t('title')}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {view === 'patient' ? <PatientView /> : <HealthPostView />}
        </div>
      </div>
    </FetchWrapper>
  );
}
