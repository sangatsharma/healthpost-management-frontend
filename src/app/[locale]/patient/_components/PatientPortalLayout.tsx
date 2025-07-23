// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useUserStore } from "@/zustand/useUserStore"
// import { getMenuItems } from "@/constants/routes.constants"
// import { useTypedTranslations } from "@/hooks/useTypedTranslations"
// import Sidebar from "@/components/sidebar/sidebar"
// import MobileSidebar from "@/components/sidebar/mobile-sidebar"
// import MobileHeader from "@/components/sidebar/mobile-header"
// import { ProtectedRoute } from "@/components/ProtectedRoutes"
// import { Permissions } from "@/zustand/permissions"

// interface PatientPortalLayoutProps {
//   children: React.ReactNode
// }

// export function PatientPortalLayout({ children }: PatientPortalLayoutProps) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
//   const { user } = useUserStore()
//   const t = useTypedTranslations("GeneralPages")

//   // if (!user) {
//   //   return <div>Loading...</div>
//   // }

//   const menuItems = getMenuItems({ itemsFor: "PATIENT", t })

//   return (
//     <ProtectedRoute requiredPermission={Permissions.PATIENT_DASHBOARD}>
//       <div className="flex h-screen bg-gray-50">
//         {/* Desktop Sidebar */}
//         <div className="hidden lg:block">
//           <Sidebar
//             user={user}
//             menuItems={menuItems}
//             isCollapsed={sidebarCollapsed}
//             onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
//           />
//         </div>

//         {/* Mobile Sidebar */}
//         <MobileSidebar
//           user={user}
//           menuItems={menuItems}
//           isOpen={mobileSidebarOpen}
//           onClose={() => setMobileSidebarOpen(false)}
//         />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Mobile Header */}
//           <div className="lg:hidden">
//             <MobileHeader user={user} onMenuClick={() => setMobileSidebarOpen(true)} />
//           </div>

//           {/* Page Content */}
//           <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   )
// }
