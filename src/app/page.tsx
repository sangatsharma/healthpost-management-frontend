import Image from 'next/image';
import { HealthPostStructuredData } from '@/components/StructuredData';

export default function Home() {
  return (
    <>
      <HealthPostStructuredData />
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/images/hp.png"
              alt="HealthPost Management System"
              width={120}
              height={120}
              priority
              className="rounded-lg shadow-lg"
            />
            <h1 className="text-center text-4xl font-bold sm:text-5xl">
              HealthPost Management System
            </h1>
            <p className="text-muted-foreground max-w-2xl text-center text-lg">
              Comprehensive health post management system for offline and online
              healthcare management
            </p>
          </div>

          <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src="/images/doctor.png"
                  alt="Patient Management"
                  width={32}
                  height={32}
                />
                <h3 className="font-semibold">Patient Management</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Manage patient records, medical history, and healthcare
                information efficiently
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src="/images/doc.png"
                  alt="Medical Records"
                  width={32}
                  height={32}
                />
                <h3 className="font-semibold">Medical Records</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Digital health record management and secure storage system
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src="/images/file.png"
                  alt="Offline Support"
                  width={32}
                  height={32}
                />
                <h3 className="font-semibold">Offline Support</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Works seamlessly both online and offline for uninterrupted
                healthcare services
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <a
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-12 items-center justify-center gap-2 rounded-lg border border-solid border-transparent px-6 text-base font-medium transition-colors"
              href="/admin/dashboard"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/hp.png"
                alt="Dashboard"
                width={20}
                height={20}
              />
              Go to Dashboard
            </a>
            <a
              className="border-border hover:bg-accent hover:text-accent-foreground flex h-12 w-full items-center justify-center rounded-lg border border-solid px-6 text-base font-medium transition-colors sm:w-auto"
              href="/patients"
              rel="noopener noreferrer"
            >
              Manage Patients
            </a>
          </div>
        </main>

        <footer className="text-muted-foreground row-start-3 flex flex-wrap items-center justify-center gap-[24px] text-sm">
          <span>© 2025 HealthPost Management System</span>
          <span>•</span>
          <span>Nepal Healthcare Solutions</span>
        </footer>
      </div>
    </>
  );
}
