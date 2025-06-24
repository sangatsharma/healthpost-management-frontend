'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Action, Permissions } from '@/zustand/permissions';
import { TPermission } from '@/types/global';
import { Button } from '@/components/ui/button';

// Simplified permission groups for cleaner UI
const permissionGroups = [
  {
    category: 'SYSTEM',
    permissions: [
      { key: Permissions.ALL, label: 'All Permissions' },
      { key: Permissions.SYSTEM_CONFIG, label: 'System Configuration' },
    ],
  },
  {
    category: 'DASHBOARD ACCESS',
    permissions: [
      { key: Permissions.PATIENT_DASHBOARD, label: 'Patient Dashboard' },
      { key: Permissions.ADMIN_DASHBOARD, label: 'Admin Dashboard' },
      {
        key: Permissions.HEALTH_POST_DASHBOARD,
        label: 'Health Post Dashboard',
      },
    ],
  },
  {
    category: 'USER MANAGEMENT',
    permissions: [
      {
        key: Permissions.HP_MANAGEMENT,
        label: 'Health Professional Management',
      },
      { key: Permissions.ADMIN_MANAGEMENT, label: 'Admin Management' },
      { key: Permissions.USER_MANAGE, label: 'User Management' },
    ],
  },
  {
    category: 'PATIENT RECORDS',
    permissions: [
      { key: Permissions.PATIENT_RECORDS, label: 'Patient Records' },
    ],
  },
  {
    category: 'CLINICAL WORKFLOWS',
    permissions: [
      { key: Permissions.PRESCRIBE_MEDICATION, label: 'Prescribe Medication' },
      { key: Permissions.ORDER_LAB_TESTS, label: 'Order Lab Tests' },
      { key: Permissions.VACCINATION_RECORD, label: 'Vaccination Records' },
      { key: Permissions.MATERNAL_HEALTH_EDIT, label: 'Maternal Health' },
    ],
  },
  {
    category: 'LABORATORY',
    permissions: [
      { key: Permissions.LAB_RESULTS_UPLOAD, label: 'Lab Results Upload' },
      {
        key: Permissions.LAB_RESULTS_VERIFY,
        label: 'Lab Results Verification',
      },
    ],
  },
  {
    category: 'COMMUNITY HEALTH',
    permissions: [
      { key: Permissions.COMMUNITY_REPORTS, label: 'Community Reports' },
      { key: Permissions.HOME_VISIT_RECORD, label: 'Home Visit Records' },
    ],
  },
  {
    category: 'INVENTORY',
    permissions: [
      { key: Permissions.INVENTORY_VIEW, label: 'Inventory View' },
      { key: Permissions.INVENTORY_MANAGE, label: 'Inventory Management' },
      { key: Permissions.MEDICINE_DISPENSE, label: 'Medicine Dispensing' },
    ],
  },
  {
    category: 'REPORTS & DATA',
    permissions: [
      { key: Permissions.REPORTS_GENERATE, label: 'Generate Reports' },
      { key: Permissions.DATA_EXPORT, label: 'Data Export' },
    ],
  },
];

interface PermissionSelectorProps {
  value?: TPermission[];
  onChange: (permissions: TPermission[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PermissionSelector({
  value = [],
  onChange,
  title = 'Select Permissions',
  subtitle = 'Permissions determine what actions a user can perform within the system.',
  className = '',
}: PermissionSelectorProps) {
  const [selectedPermissions, setSelectedPermissions] =
    useState<TPermission[]>(value);

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedPermissions(value);
  }, [value]);

  // Get all permissions except ALL
  const getAllNonAllPermissions = (): Permissions[] => {
    return permissionGroups
      .flatMap((group) => group.permissions)
      .map((p) => p.key)
      .filter((permission) => permission !== Permissions.ALL);
  };

  // Helper function to check if a specific permission and action combination exists
  const hasPermission = (resource: Permissions, action: Action): boolean => {
    return selectedPermissions.some(
      (permission) =>
        permission.resource === resource && permission.action === action,
    );
  };

  // Helper function to add a permission if it doesn't exist
  const addPermission = (
    permissions: TPermission[],
    resource: Permissions,
    action: Action,
  ): TPermission[] => {
    const exists = permissions.some(
      (p) => p.resource === resource && p.action === action,
    );
    if (!exists) {
      return [...permissions, { resource, action }];
    }
    return permissions;
  };

  // Helper function to remove a permission
  const removePermission = (
    permissions: TPermission[],
    resource: Permissions,
    action?: Action,
  ): TPermission[] => {
    if (action) {
      // Remove specific action for the resource
      return permissions.filter(
        (p) => !(p.resource === resource && p.action === action),
      );
    } else {
      // Remove all actions for the resource
      return permissions.filter((p) => p.resource !== resource);
    }
  };

  // Check if all non-ALL permissions have a specific action
  const allNonAllPermissionsHaveAction = (
    permissions: TPermission[],
    action: Action,
  ): boolean => {
    const allNonAllPermissions = getAllNonAllPermissions();
    return allNonAllPermissions.every((resource) =>
      permissions.some((p) => p.resource === resource && p.action === action),
    );
  };

  // Check if all non-ALL permissions have both READ and WRITE
  const allNonAllPermissionsHaveBothActions = (
    permissions: TPermission[],
  ): boolean => {
    return (
      allNonAllPermissionsHaveAction(permissions, Action.READ) &&
      allNonAllPermissionsHaveAction(permissions, Action.WRITE)
    );
  };

  // Auto-manage ALL permission based on individual permissions
  const autoManageAllPermission = (
    permissions: TPermission[],
  ): TPermission[] => {
    let newPermissions = [...permissions];

    // Remove existing ALL permissions first
    newPermissions = removePermission(newPermissions, Permissions.ALL);

    // Check if all individual permissions have both READ and write
    if (allNonAllPermissionsHaveBothActions(newPermissions)) {
      // Add both READ and write for ALL
      newPermissions = addPermission(
        newPermissions,
        Permissions.ALL,
        Action.READ,
      );
      newPermissions = addPermission(
        newPermissions,
        Permissions.ALL,
        Action.WRITE,
      );
    } else if (allNonAllPermissionsHaveAction(newPermissions, Action.READ)) {
      // Add only read for ALL
      newPermissions = addPermission(
        newPermissions,
        Permissions.ALL,
        Action.READ,
      );
    }

    return newPermissions;
  };

  // Handle ALL permission special logic
  const handleAllPermission = (
    action: Action,
    checked: boolean,
  ): TPermission[] => {
    let newPermissions = [...selectedPermissions];
    const allNonAllPermissions = getAllNonAllPermissions();

    if (action === Action.READ) {
      if (checked) {
        // Add READ permission for ALL
        newPermissions = addPermission(
          newPermissions,
          Permissions.ALL,
          Action.READ,
        );
        // Add READ permission for all other resources
        allNonAllPermissions.forEach((resource) => {
          newPermissions = addPermission(newPermissions, resource, Action.READ);
        });
      } else {
        // Remove READ permission for ALL and all other resources
        // Also remove WRITE permissions since WRITE requires READ
        newPermissions = removePermission(newPermissions, Permissions.ALL);
        allNonAllPermissions.forEach((resource) => {
          newPermissions = removePermission(newPermissions, resource);
        });
      }
    } else if (action === Action.WRITE) {
      if (checked) {
        // Add both read and write permissions for ALL and all other resources
        newPermissions = addPermission(
          newPermissions,
          Permissions.ALL,
          Action.READ,
        );
        newPermissions = addPermission(
          newPermissions,
          Permissions.ALL,
          Action.WRITE,
        );
        allNonAllPermissions.forEach((resource) => {
          newPermissions = addPermission(newPermissions, resource, Action.READ);
          newPermissions = addPermission(
            newPermissions,
            resource,
            Action.WRITE,
          );
        });
      } else {
        // Remove only WRITE permission for ALL and all other resources
        newPermissions = removePermission(
          newPermissions,
          Permissions.ALL,
          Action.WRITE,
        );
        allNonAllPermissions.forEach((resource) => {
          newPermissions = removePermission(
            newPermissions,
            resource,
            Action.WRITE,
          );
        });
      }
    }

    return newPermissions;
  };

  // Handle individual permission changes (non-ALL)
  const handleIndividualPermission = (
    resource: Permissions,
    action: Action,
    checked: boolean,
  ): TPermission[] => {
    let newPermissions = [...selectedPermissions];

    if (action === Action.READ) {
      if (checked) {
        // Add READ permission
        newPermissions = addPermission(newPermissions, resource, Action.READ);
      } else {
        // Remove READ permission and also remove WRITE permission (since WRITE requires READ)
        newPermissions = removePermission(newPermissions, resource); // Remove all actions for this resource
      }
    } else if (action === Action.WRITE) {
      if (checked) {
        // Ensure READ permission exists first, then add WRITE permission
        newPermissions = addPermission(newPermissions, resource, Action.READ);
        newPermissions = addPermission(newPermissions, resource, Action.WRITE);
      } else {
        // Remove only WRITE permission, keep read
        newPermissions = removePermission(
          newPermissions,
          resource,
          Action.WRITE,
        );
      }
    }

    // If ALL was previously selected, uncheck it since individual permissions are being modified
    if (
      hasPermission(Permissions.ALL, Action.READ) ||
      hasPermission(Permissions.ALL, Action.WRITE)
    ) {
      newPermissions = removePermission(newPermissions, Permissions.ALL);
    }

    // Auto-manage ALL permission based on current state
    newPermissions = autoManageAllPermission(newPermissions);

    return newPermissions;
  };

  // Handle checkbox change with READ-WRITE dependency logic
  const handlePermissionChange = (
    resource: Permissions,
    action: Action,
    checked: boolean,
  ) => {
    let newPermissions = [...selectedPermissions];

    // Special handling for ALL permission
    if (resource === Permissions.ALL) {
      newPermissions = handleAllPermission(action, checked);
    } else {
      // Handle individual permission changes
      newPermissions = handleIndividualPermission(resource, action, checked);
    }

    setSelectedPermissions(newPermissions);
    onChange(newPermissions);
  };

  // Helper function to get count of selected permissions for a group
  const getGroupSelectedCount = (groupPermissions: Permissions[]): number => {
    return groupPermissions.reduce((count, permission) => {
      const hasRead = hasPermission(permission, Action.READ);
      const hasWrite = hasPermission(permission, Action.WRITE);
      return count + (hasRead ? 1 : 0) + (hasWrite ? 1 : 0);
    }, 0);
  };

  // Helper function to select/deselect all permissions in a group
  const toggleGroupPermissions = (
    groupPermissions: Permissions[],
    selectAll: boolean,
  ) => {
    let newPermissions = [...selectedPermissions];

    groupPermissions.forEach((resource) => {
      // Skip ALL permission in group operations to avoid conflicts
      if (resource === Permissions.ALL) return;

      // Remove existing permissions for this resource
      newPermissions = removePermission(newPermissions, resource);

      // Add new permissions if selectAll is true
      if (selectAll) {
        newPermissions = addPermission(newPermissions, resource, Action.READ);
        newPermissions = addPermission(newPermissions, resource, Action.WRITE);
      }
    });

    // If ALL was previously selected, uncheck it since individual permissions are being modified
    if (
      hasPermission(Permissions.ALL, Action.READ) ||
      hasPermission(Permissions.ALL, Action.WRITE)
    ) {
      newPermissions = removePermission(newPermissions, Permissions.ALL);
    }

    // Auto-manage ALL permission based on current state
    newPermissions = autoManageAllPermission(newPermissions);

    setSelectedPermissions(newPermissions);
    onChange(newPermissions);
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 dark:bg-[#1f1f1f] dark:text-white">
            <div className="col-span-8">Permissions</div>
            <div className="col-span-2 text-center">Read</div>
            <div className="col-span-2 text-center">Write</div>
          </div>

          {/* Permission Rows */}
          {permissionGroups.map((group) => {
            const groupPermissions = group.permissions.map((p) => p.key);
            const selectedCount = getGroupSelectedCount(groupPermissions);

            return (
              <div key={group.category}>
                {/* Category Header */}
                <div className="grid grid-cols-12 gap-4 border-b bg-gray-100 px-6 py-3 dark:bg-[#181717]">
                  <div className="col-span-8 flex items-center justify-between">
                    <span className="text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-white">
                      {group.category}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        onClick={() =>
                          toggleGroupPermissions(groupPermissions, true)
                        }
                        variant={'outline'}
                        className="rounded px-2 py-1 text-xs text-green-600 hover:bg-blue-50 hover:text-blue-800"
                      >
                        All
                      </Button>
                      <Button
                        type="button"
                        onClick={() =>
                          toggleGroupPermissions(groupPermissions, false)
                        }
                        variant={'outline'}
                        className="rounded px-2 py-1 text-xs text-red-400"
                      >
                        None
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium text-gray-700">
                    Read
                    {selectedCount > 0 && (
                      <span className="ml-1 text-xs text-blue-600">
                        (
                        {
                          groupPermissions.filter((p) =>
                            hasPermission(p, Action.READ),
                          ).length
                        }
                        )
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium text-gray-700">
                    Write
                    {selectedCount > 0 && (
                      <span className="ml-1 text-xs text-blue-600">
                        (
                        {
                          groupPermissions.filter((p) =>
                            hasPermission(p, Action.WRITE),
                          ).length
                        }
                        )
                      </span>
                    )}
                  </div>
                </div>

                {/* Permission Items */}
                {group.permissions.map((permission) => {
                  const hasRead = hasPermission(permission.key, Action.READ);
                  const hasWrite = hasPermission(permission.key, Action.WRITE);
                  const isAllPermission = permission.key === Permissions.ALL;

                  return (
                    <div
                      key={permission.key}
                      className={`grid grid-cols-12 gap-4 border-b px-6 py-4 transition-colors hover:bg-gray-50 dark:bg-[#1f1f1f] dark:hover:bg-[#2b2b2b] ${
                        isAllPermission ? 'border-blue-200 bg-blue-50' : ''
                      }`}
                    >
                      <div className="col-span-8">
                        <span
                          className={`text-sm ${isAllPermission ? 'font-semibold text-green-400' : 'text-gray-900 dark:text-white'}`}
                        >
                          {permission.label}
                          {isAllPermission && (
                            <span className="ml-2 text-xs text-green-600">
                              (Master Control)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Checkbox
                          checked={hasRead}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              permission.key,
                              Action.READ,
                              checked as boolean,
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Checkbox
                          checked={hasWrite}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              permission.key,
                              Action.WRITE,
                              checked as boolean,
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
