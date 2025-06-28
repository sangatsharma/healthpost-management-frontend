# Translation Keys Usage Documentation

This document provides a comprehensive mapping of where each translation key from `en.json` is used throughout the application. This will help developers easily locate and fix typos or update translations.

## GeneralPages

### Common UI Elements

- **`actions`**: Used in data tables and action buttons across the application
- **`reset`**: Used in forms and filters for reset functionality
- **`images`**: Used in image upload components and file handling
- **`search`**: Used in data tables and search components

### NotFound (404 Page)

**File**: `/src/app/not-found.tsx`

- **`NotFound.title`**: Main heading on 404 page
- **`NotFound.description`**: Description text on 404 page
- **`NotFound.returnHome`**: Button text to return home
- **`NotFound.contactSupport`**: Button text for support contact

### Unauthorized Page

**File**: `/src/app/[locale]/unauthorized/page.tsx`

- **`unauthorized.title`**: Main heading on unauthorized access page
- **`unauthorized.description`**: Description text on unauthorized page

### Sidebar Navigation

**Files**:

- `/src/components/sidebar/sidebar.tsx`
- `/src/components/sidebar/mobile-sidebar.tsx`
- `/src/constants/routes.constants.ts`

- **`SidebarItems.dashboard`**: Dashboard menu item
- **`SidebarItems.healthpost`**: Health Posts menu item
- **`SidebarItems.patients`**: Patients menu item
- **`SidebarItems.staffsmanagement`**: Staff Management menu item
- **`SidebarItems.medicalhistory`**: Medical History menu item

### HealthPost Management

**Files**:

- `/src/app/[locale]/admin/healthpost/page.tsx`
- `/src/app/[locale]/admin/healthpost/_components/HealthPostModal.tsx`

- **`HealthPost.name`**: HealthPost name field label
- **`HealthPost.wardNo`**: Ward number field label
- **`HealthPost.municipality`**: Municipality field label
- **`HealthPost.location`**: Location field label
- **`HealthPost.email`**: Email field label
- **`HealthPost.description`**: Description field label
- **`HealthPost.status`**: Status field label
- **`HealthPost.phone`**: Contact number field label
- **`HealthPost.createdAt`**: Created date field label
- **`HealthPost.addHealthPost`**: Add new healthpost button/modal title
- **`HealthPost.editHealthPost`**: Edit healthpost button/modal title
- **`HealthPost.number`**: Number formatting template

### User/Staff Management

**Files**:

- `/src/app/[locale]/admin/staffs/page.tsx`
- `/src/app/[locale]/admin/staffs/_components/StaffModal.tsx`

- **`User.fullName`**: Full name field label
- **`User.email`**: Email field label
- **`User.role`**: Role field label
- **`User.accountType`**: Account type field label
- **`User.permissions`**: Permissions field label
- **`User.gender`**: Gender field label
- **`User.profileImage`**: Profile image field label
- **`User.addStaff`**: Add new staff button/modal title
- **`User.editStaff`**: Edit staff button/modal title

### Patient Management

**Files**:

- `/src/app/[locale]/admin/admitpatients/page.tsx`
- `/src/app/[locale]/admin/admitpatients/_components/PatientDataTable.tsx`
- `/src/app/[locale]/admin/admitpatients/_components/PatientDetailsModal.tsx`
- `/src/app/[locale]/admin/admitpatients/_components/PatientRegistrationModal.tsx`

#### Patient Fields

- **`Patient.firstName`**: First name field label
- **`Patient.lastName`**: Last name field label
- **`Patient.fullName`**: Full name display/field label
- **`Patient.email`**: Email field label
- **`Patient.phone`**: Phone number field label
- **`Patient.address`**: Address field label
- **`Patient.dateOfBirth`**: Date of birth field label
- **`Patient.gender`**: Gender field label
- **`Patient.age`**: Age field label
- **`Patient.bloodGroup`**: Blood group field label

#### Emergency Contact

- **`Patient.emergencyContact`**: Emergency contact section header
- **`Patient.emergencyContactName`**: Emergency contact name field
- **`Patient.emergencyContactPhone`**: Emergency contact phone field
- **`Patient.emergencyContactRelation`**: Emergency contact relation field

#### Medical Information

- **`Patient.medicalHistory`**: Medical history field label
- **`Patient.allergies`**: Allergies field label
- **`Patient.currentMedications`**: Current medications field label

#### Status and Actions

- **`Patient.registrationDate`**: Registration date field label
- **`Patient.status`**: Status field label
- **`Patient.active`**: Active status option
- **`Patient.inactive`**: Inactive status option

#### Patient Actions

- **`Patient.addPatient`**: Add new patient button/modal title
- **`Patient.editPatient`**: Edit patient button/modal title
- **`Patient.viewPatient`**: View patient details button/modal title
- **`Patient.deletePatient`**: Delete patient button text
- **`Patient.patientRegistry`**: Patient registry page title
- **`Patient.actions`**: Actions column header
- **`Patient.view`**: View action button
- **`Patient.edit`**: Edit action button
- **`Patient.delete`**: Delete action button
- **`Patient.save`**: Save button text
- **`Patient.cancel`**: Cancel button text

#### Patient Information Sections

- **`Patient.patientDetails`**: Patient details section header
- **`Patient.personalInformation`**: Personal information section
- **`Patient.contactInformation`**: Contact information section
- **`Patient.medicalInformation`**: Medical information section

#### Gender Options

- **`Patient.male`**: Male gender option
- **`Patient.female`**: Female gender option
- **`Patient.other`**: Other gender option

#### Blood Group Options

- **`Patient.aPositive`**: A+ blood type
- **`Patient.aNegative`**: A- blood type
- **`Patient.bPositive`**: B+ blood type
- **`Patient.bNegative`**: B- blood type
- **`Patient.abPositive`**: AB+ blood type
- **`Patient.abNegative`**: AB- blood type
- **`Patient.oPositive`**: O+ blood type
- **`Patient.oNegative`**: O- blood type
- **`Patient.unknown`**: Unknown blood type

## Validation

**Files**:

- `/src/lib/validators.ts`
- `/src/components/LoginForm.tsx`
- `/src/app/[locale]/admin/staffs/_components/StaffModal.tsx`
- `/src/app/[locale]/admin/healthpost/_components/HealthPostModal.tsx`

### General Validation Messages

- **`required`**: Generic required field message
- **`email`**: Invalid email format message
- **`otp`**: OTP validation message
- **`minLength`**: Minimum length validation (with {min} parameter)
- **`maxLength`**: Maximum length validation (with {max} parameter)
- **`phone`**: Invalid phone number message
- **`status`**: Status field required message
- **`minSelection`**: Minimum selection required (with {min} parameter)
- **`maxSelection`**: Maximum selection allowed (with {max} parameter)

### HealthPost Specific Validation

- **`Healthpost.name`**: HealthPost name required message
- **`Healthpost.wardNo`**: Ward number required message
- **`Healthpost.municipality`**: Municipality required message
- **`Healthpost.location`**: Location required message
- **`Healthpost.email`**: HealthPost email required message
- **`Healthpost.description`**: Description required message

### Admin Specific Validation

- **`Admin.email`**: Admin email required message
- **`Admin.phone`**: Admin phone validation message

## Login

**File**: `/src/components/LoginForm.tsx`

### Login Interface

- **`logInToYourAccount`**: Main login form title
- **`email`**: Email field label
- **`login`**: Login button text
- **`admin_portal`**: Admin portal option
- **`patient_portal`**: Patient portal option
- **`healthpost_portal`**: HealthPost portal option
- **`login_desc`**: Login description text
- **`email_placeholder`**: Email input placeholder

### OTP Process

- **`send_OTP`**: Send OTP button text
- **`enter_OTP`**: OTP entry instruction text
- **`verify_OTP`**: Verify OTP button text
- **`didn't_receive_OTP`**: Didn't receive code text
- **`resend_OTP`**: Resend OTP link text

### Loading States

- **`logging`**: Logging in progress text
- **`verifying_OTP`**: OTP verification in progress text

## MedicalHistory

**Note**: Based on the structure, this appears to be used in medical history components, though specific usage files weren't found in the current search.

### Medical History Interface

- **`title`**: Medical history page title
- **`subtitle`**: Medical history page subtitle
- **`patientInfo`**: Patient information section
- **`diagnosis`**: Diagnosis field/section
- **`symptoms`**: Symptoms field/section
- **`treatment`**: Treatment field/section
- **`medications`**: Medications field/section
- **`vitals`**: Vital signs section
- **`doctor`**: Doctor field
- **`healthPost`**: Health post field
- **`date`**: Date field
- **`time`**: Time field
- **`age`**: Age field
- **`gender`**: Gender field
- **`notes`**: Notes field
- **`nextAppointment`**: Next appointment field
- **`status`**: Status field
- **`priority`**: Priority field

### Vital Signs

- **`bloodPressure`**: Blood pressure measurement
- **`temperature`**: Temperature measurement
- **`heartRate`**: Heart rate measurement
- **`weight`**: Weight measurement
- **`height`**: Height measurement

### Medication Details

- **`dosage`**: Medication dosage
- **`frequency`**: Medication frequency
- **`duration`**: Medication duration

### Filters and Actions

- **`filterAll`**: All records filter
- **`filterCompleted`**: Completed records filter
- **`filterOngoing`**: Ongoing records filter
- **`filterFollowup`**: Follow-up required filter
- **`downloadReport`**: Download report button
- **`years`**: Years unit text
- **`noRecordsFound`**: No records found message

## AlertDialog

**Files**:

- `/src/components/reusables/form-dialog.tsx`
- `/src/hooks/useGlobalAlert.ts`

### Action Buttons

- **`action.delete`**: Delete action button
- **`action.cancel`**: Cancel action button
- **`action.ok`**: OK action button
- **`action.yes`**: Yes action button
- **`action.no`**: No action button

### Dialog Content

- **`dialog.confirm`**: Confirm dialog title
- **`dialog.deleteTitle`**: Delete confirmation dialog title
- **`dialog.deleteDescription`**: Delete confirmation message (with {item} parameter)
- **`dialog.sureConfirmation`**: "Are you sure?" confirmation text
- **`dialog.formLostDescription`**: Form data loss warning
- **`dialog.keepEditing`**: Keep editing button text
- **`dialog.cancelForm`**: Cancel form button text

## Usage Tips

1. **Parameter Replacement**: Some messages use parameters like `{min}`, `{max}`, `{item}`, `{number}` - ensure these are properly replaced when using the translations.

2. **Nested Keys**: Use dot notation to access nested keys (e.g., `t('NotFound.title')`, `t('Patient.emergencyContactName')`).

3. **Type Safety**: The application uses `useTypedTranslations` hook for type-safe translation access.

4. **File Locations**: When making changes, refer to the specific files listed above to understand the context of each translation key.

5. **Validation Messages**: Validation messages are often used in form schemas and validators, so changes may affect form validation behavior.
