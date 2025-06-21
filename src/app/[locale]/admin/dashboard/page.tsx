'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
// import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { Permissions } from '@/zustand/permissions';
import {
  Building2,
  Users,
  Activity,
  UserCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  Bar,
  ComposedChart,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useState } from 'react';

interface DashboardProps {
  params: {
    locale: string;
  };
}

export default function AdminDashboard({ params }: DashboardProps) {
  const { locale } = params;
  // const t = useTypedTranslations('GeneralPages')
  const isNepali = locale === 'np';

  // Locale-based data
  const getLocaleData = () => {
    return {
      labels: {
        title: isNepali ? 'एडमिन ड्यासबोर्ड' : 'Admin Dashboard',
        subtitle: isNepali
          ? 'स्वास्थ्य पोस्ट व्यवस्थापन प्रणाली अवलोकन'
          : 'Health Post Management System Overview',
        totalHealthPosts: isNepali
          ? 'कुल स्वास्थ्य पोस्टहरू'
          : 'Total Health Posts',
        totalVisits: isNepali ? 'कुल बिरामी भेटहरू' : 'Total Patient Visits',
        totalUsers: isNepali ? 'दर्ता भएका प्रयोगकर्ताहरू' : 'Registered Users',
        totalStaff: isNepali ? 'कुल कर्मचारीहरू' : 'Total Staff Members',
        topHealthPostsByVisits: isNepali
          ? 'भेट अनुसार शीर्ष स्वास्थ्य पोस्टहरू'
          : 'Top Health Posts by Visits',
        topHealthPostsByUsers: isNepali
          ? 'प्रयोगकर्ता दर्ता अनुसार शीर्ष स्वास्थ्य पोस्टहरू'
          : 'Top Health Posts by Users',
        viewAll: isNepali ? 'सबै हेर्नुहोस्' : 'View All',
        visits: isNepali ? 'भेटहरू' : 'visits',
        users: isNepali ? 'प्रयोगकर्ताहरू' : 'users',
        thisMonth: isNepali ? 'यो महिना' : 'this month',
        fromLastMonth: isNepali ? 'गत महिनाबाट' : 'from last month',
        acrossAllHealthPosts: isNepali
          ? 'सबै स्वास्थ्य पोस्टहरूमा'
          : 'Across all health posts',
        monthlyTrend: isNepali ? 'मासिक प्रवृत्ति' : 'Monthly Trend',
        visitDistribution: isNepali ? 'भेट वितरण' : 'Visit Distribution',
      },
      healthPosts: isNepali
        ? [
            {
              id: 1,
              name: 'काठमाडौं केन्द्रीय स्वास्थ्य पोस्ट',
              visits: 2341,
              location: 'काठमाडौं',
              users: 456,
            },
            {
              id: 2,
              name: 'पोखरा उपत्यका स्वास्थ्य केन्द्र',
              visits: 1987,
              location: 'पोखरा',
              users: 389,
            },
            {
              id: 3,
              name: 'चितवन सामुदायिक स्वास्थ्य पोस्ट',
              visits: 1654,
              location: 'चितवन',
              users: 298,
            },
            {
              id: 4,
              name: 'ललितपुर मेडिकल सेन्टर',
              visits: 1432,
              location: 'ललितपुर',
              users: 321,
            },
            {
              id: 5,
              name: 'भक्तपुर स्वास्थ्य स्टेशन',
              visits: 1298,
              location: 'भक्तपुर',
              users: 267,
            },
          ]
        : [
            {
              id: 1,
              name: 'Kathmandu Central Health Post',
              visits: 2341,
              location: 'Kathmandu',
              users: 456,
            },
            {
              id: 2,
              name: 'Pokhara Valley Health Center',
              visits: 1987,
              location: 'Pokhara',
              users: 389,
            },
            {
              id: 3,
              name: 'Chitwan Community Health Post',
              visits: 1654,
              location: 'Chitwan',
              users: 298,
            },
            {
              id: 4,
              name: 'Lalitpur Medical Center',
              visits: 1432,
              location: 'Lalitpur',
              users: 321,
            },
            {
              id: 5,
              name: 'Bhaktapur Health Station',
              visits: 1298,
              location: 'Bhaktapur',
              users: 267,
            },
          ],
    };
  };

  const data = getLocaleData();

  // Chart data
  const monthlyVisitsData = [
    { month: 'Jan', visits: 1200, users: 180 },
    { month: 'Feb', visits: 1400, users: 220 },
    { month: 'Mar', visits: 1100, users: 190 },
    { month: 'Apr', visits: 1600, users: 280 },
    { month: 'May', visits: 1800, users: 320 },
    { month: 'Jun', visits: 2100, users: 380 },
  ];

  const visitDistributionData = [
    { name: 'General Checkup', value: 35, color: '#10b981' },
    { name: 'Emergency', value: 25, color: '#ef4444' },
    { name: 'Vaccination', value: 20, color: '#3b82f6' },
    { name: 'Consultation', value: 20, color: '#f59e0b' },
  ];

  // Period filter state
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'year'
  >('month');

  // Enhanced visit data with period comparison and spike detection
  const getVisitComparisonData = (period: 'week' | 'month' | 'year') => {
    const weekData = [
      {
        period: isNepali ? 'आइत' : 'Sun',
        current: 120,
        previous: 95,
        isSpike: false,
      },
      {
        period: isNepali ? 'सोम' : 'Mon',
        current: 180,
        previous: 165,
        isSpike: false,
      },
      {
        period: isNepali ? 'मंगल' : 'Tue',
        current: 220,
        previous: 190,
        isSpike: false,
      },
      {
        period: isNepali ? 'बुध' : 'Wed',
        current: 350,
        previous: 200,
        isSpike: true,
      }, // Spike detected
      {
        period: isNepali ? 'बिहि' : 'Thu',
        current: 280,
        previous: 210,
        isSpike: false,
      },
      {
        period: isNepali ? 'शुक्र' : 'Fri',
        current: 320,
        previous: 280,
        isSpike: false,
      },
      {
        period: isNepali ? 'शनि' : 'Sat',
        current: 150,
        previous: 140,
        isSpike: false,
      },
    ];

    const monthData = [
      {
        period: isNepali ? 'जनवरी' : 'Jan',
        current: 1200,
        previous: 1100,
        isSpike: false,
      },
      {
        period: isNepali ? 'फेब्रुअरी' : 'Feb',
        current: 1400,
        previous: 1250,
        isSpike: false,
      },
      {
        period: isNepali ? 'मार्च' : 'Mar',
        current: 1100,
        previous: 1300,
        isSpike: false,
      },
      {
        period: isNepali ? 'अप्रिल' : 'Apr',
        current: 2100,
        previous: 1400,
        isSpike: true,
      }, // Spike detected
      {
        period: isNepali ? 'मे' : 'May',
        current: 1800,
        previous: 1600,
        isSpike: false,
      },
      {
        period: isNepali ? 'जुन' : 'Jun',
        current: 2200,
        previous: 1750,
        isSpike: false,
      },
    ];

    const yearData = [
      { period: '2019', current: 12000, previous: 11000, isSpike: false },
      { period: '2020', current: 8500, previous: 13000, isSpike: false }, // COVID impact
      { period: '2021', current: 15000, previous: 9000, isSpike: true }, // Recovery spike
      { period: '2022', current: 18000, previous: 15500, isSpike: false },
      { period: '2023', current: 21000, previous: 18500, isSpike: false },
      { period: '2024', current: 24000, previous: 21500, isSpike: false },
    ];

    return period === 'week'
      ? weekData
      : period === 'month'
        ? monthData
        : yearData;
  };

  const visitComparisonData = getVisitComparisonData(selectedPeriod);

  // Period filter labels
  const periodLabels = {
    week: isNepali ? 'हप्ता' : 'Week',
    month: isNepali ? 'महिना' : 'Month',
    year: isNepali ? 'वर्ष' : 'Year',
  };

  const comparisonLabels = {
    title: isNepali ? 'बिरामी आउने दरको तुलना' : 'Patient Visit Comparison',
    subtitle: isNepali
      ? 'हालको र अघिल्लो अवधिको तुलना'
      : 'Current vs Previous Period Comparison',
    current: isNepali ? 'हालको अवधि' : 'Current Period',
    previous: isNepali ? 'अघिल्लो अवधि' : 'Previous Period',
    spike: isNepali ? 'अचानक वृद्धि' : 'Spike Detected',
    spikeDesc: isNepali
      ? 'सामान्यभन्दा ५०% बढी भेट'
      : '50% above normal visits',
  };

  const mockKpis = {
    totalHealthPosts: 24,
    totalVisits: 15847,
    totalUsers: 3421,
    totalStaff: 156,
  };

  return (
    <ProtectedRoute requiredPermission={Permissions.ADMIN_DASHBOARD}>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="border-border bg-card border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-foreground text-2xl font-bold">
                    {data.labels.title}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {data.labels.subtitle}
                  </p>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* KPI Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-green-500 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {data.labels.totalHealthPosts}
                </CardTitle>
                <Building2 className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold">
                  {mockKpis.totalHealthPosts}
                </div>
                <div className="mt-1 flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2 {data.labels.thisMonth}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {data.labels.totalVisits}
                </CardTitle>
                <Activity className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold">
                  {mockKpis.totalVisits.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12% {data.labels.fromLastMonth}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {data.labels.totalUsers}
                </CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold">
                  {mockKpis.totalUsers.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +8% {data.labels.fromLastMonth}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {data.labels.totalStaff}
                </CardTitle>
                <UserCheck className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold">
                  {mockKpis.totalStaff}
                </div>
                <div className="text-muted-foreground mt-1 flex items-center text-xs">
                  <span>{data.labels.acrossAllHealthPosts}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Charts Section */}
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Patient Visit Comparison Chart - Takes 2 columns */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      {comparisonLabels.title}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {comparisonLabels.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['week', 'month', 'year'] as const).map((period) => (
                      <Button
                        key={period}
                        variant={
                          selectedPeriod === period ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className={
                          selectedPeriod === period
                            ? 'bg-green-600 hover:bg-green-700'
                            : ''
                        }
                      >
                        {periodLabels[period]}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    current: {
                      label: comparisonLabels.current,
                      color: 'hsl(var(--chart-1))',
                    },
                    previous: {
                      label: comparisonLabels.previous,
                      color: 'hsl(var(--chart-2))',
                    },
                    spike: {
                      label: comparisonLabels.spike,
                      color: '#ef4444',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={visitComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const isSpike = data.isSpike;
                            return (
                              <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
                                <p className="font-medium">{label}</p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                    <span className="text-sm">
                                      {comparisonLabels.current}:{' '}
                                      {data.current.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                                    <span className="text-sm">
                                      {comparisonLabels.previous}:{' '}
                                      {data.previous.toLocaleString()}
                                    </span>
                                  </div>
                                  {isSpike && (
                                    <div className="mt-2 flex items-center gap-2 rounded bg-red-50 p-2 dark:bg-red-900/20">
                                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                        {comparisonLabels.spike}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="previous"
                        stackId="1"
                        stroke="var(--color-previous)"
                        fill="var(--color-previous)"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="current"
                        stackId="2"
                        stroke="var(--color-current)"
                        fill="var(--color-current)"
                        fillOpacity={0.6}
                      />
                      <Bar
                        dataKey={(entry) => (entry.isSpike ? entry.current : 0)}
                        fill="#ef4444"
                        fillOpacity={0.8}
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Spike Legend */}
                <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      <span>{comparisonLabels.current}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                      <span>{comparisonLabels.previous}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                      <span className="text-red-600 dark:text-red-400">
                        {comparisonLabels.spike}
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {comparisonLabels.spikeDesc}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visit Distribution Chart - Takes 1 column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  {data.labels.visitDistribution}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: 'Percentage',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visitDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {visitDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {visitDistributionData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart - Separate row */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  {data.labels.monthlyTrend}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    visits: {
                      label: data.labels.totalVisits,
                      color: 'hsl(var(--chart-1))',
                    },
                    users: {
                      label: data.labels.totalUsers,
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyVisitsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="visits"
                        stroke="var(--color-visits)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--color-users)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Compact Overview Sections */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Health Posts by Visits */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-base font-semibold">
                    {data.labels.topHealthPostsByVisits}
                  </CardTitle>
                  <Button variant="outline" size="sm" className="h-8 gap-2">
                    {data.labels.viewAll}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.healthPosts.slice(0, 3).map((healthPost, index) => (
                  <div
                    key={healthPost.id}
                    className="hover:bg-accent/50 flex items-center justify-between rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-600 dark:bg-green-900">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">
                          {healthPost.name}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {healthPost.location}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-xs text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      {healthPost.visits.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Posts by User Registration */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-base font-semibold">
                    {data.labels.topHealthPostsByUsers}
                  </CardTitle>
                  <Button variant="outline" size="sm" className="h-8 gap-2">
                    {data.labels.viewAll}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.healthPosts.slice(0, 3).map((healthPost, index) => (
                  <div
                    key={healthPost.id}
                    className="hover:bg-accent/50 flex items-center justify-between rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-600 dark:bg-purple-900">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">
                          {healthPost.name}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {healthPost.location}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-xs text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    >
                      {healthPost.users}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
