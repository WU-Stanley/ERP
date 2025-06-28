export enum Permissions {
  // System & Admin
  AdminAccess = 'AdminAccess',
  AccessDashboard = 'AccessDashboard',
  ViewAuditLogs = 'ViewAuditLogs',
  ConfigureSystemSettings = 'ConfigureSystemSettings',

  // User Management
  ManageUsers = 'ManageUsers',
  ViewUsers = 'ViewUsers',
  CreateUser = 'CreateUser',
  EditUser = 'EditUser',
  DeleteUser = 'DeleteUser',
  ActivateDeactivateUser = 'ActivateDeactivateUser',
  ResetUserPassword = 'ResetUserPassword',
  ManageDepartmentUsers = 'ManageDepartmentUsers',
  ViewDepartmentUsers = 'ViewDepartmentUsers',

  // Roles & Permissions
  ManageRoles = 'ManageRoles',
  ViewRoles = 'ViewRoles',
  CreateRole = 'CreateRole',
  EditRole = 'EditRole',
  DeleteRole = 'DeleteRole',
  AssignRolesToUser = 'AssignRolesToUser',
  ManagePermissions = 'ManagePermissions',
  ViewPermissions = 'ViewPermissions',
  AssignPermissionsToRole = 'AssignPermissionsToRole',
  RevokePermissionsFromRole = 'RevokePermissionsFromRole',

  // Approvals
  ApproveRequests = 'ApproveRequests',
  RejectRequests = 'RejectRequests',
  ViewPendingApprovals = 'ViewPendingApprovals',
  ApproveLeaveInDepartment = 'ApproveLeaveInDepartment',
  ApproveDocumentInDepartment = 'ApproveDocumentInDepartment',
  ApproveProfileUpdateInDepartment = 'ApproveProfileUpdateInDepartment',

  // Self-service
  ViewOwnProfile = 'ViewOwnProfile',
  UpdateOwnContactDetails = 'UpdateOwnContactDetails',
  UpdateOwnBankDetails = 'UpdateOwnBankDetails',
  UpdateOwnNextOfKin = 'UpdateOwnNextOfKin',
  RequestPermissionChange = 'RequestPermissionChange',
  ViewOwnPayslip = 'ViewOwnPayslip',
  RequestLeave = 'RequestLeave',
  ViewOwnAttendance = 'ViewOwnAttendance',

  // Recruitment
  CreateJobPost = 'CreateJobPost',
  EditJobPost = 'EditJobPost',
  DeleteJobPost = 'DeleteJobPost',
  PublishJobPost = 'PublishJobPost',
  ViewJobApplicants = 'ViewJobApplicants',
  ScheduleInterview = 'ScheduleInterview',
  UpdateInterviewStatus = 'UpdateInterviewStatus',
  SendOfferLetter = 'SendOfferLetter',
  RejectApplicant = 'RejectApplicant',

  // Employee Management
  ViewEmployeeProfiles = 'ViewEmployeeProfiles',
  ViewDepartmentEmployeeProfiles = 'ViewDepartmentEmployeeProfiles',
  UpdateEmployeeProfiles = 'UpdateEmployeeProfiles',
  UploadEmployeeDocuments = 'UploadEmployeeDocuments',
  GenerateEmployeeReport = 'GenerateEmployeeReport',
  AssignSupervisor = 'AssignSupervisor',

  // Onboarding/Offboarding
  InitiateOnboarding = 'InitiateOnboarding',
  CompleteOnboarding = 'CompleteOnboarding',
  InitiateOffboarding = 'InitiateOffboarding',
  ProcessExitClearance = 'ProcessExitClearance',
  SendExitLetter = 'SendExitLetter',

  // Leave & Attendance
  ManageLeaveRequests = 'ManageLeaveRequests',
  ApproveLeave = 'ApproveLeave',
  RejectLeave = 'RejectLeave',
  ViewLeaveCalendar = 'ViewLeaveCalendar',
  ViewAttendanceRecords = 'ViewAttendanceRecords',
  UpdateAttendance = 'UpdateAttendance',
  ViewDepartmentAttendance = 'ViewDepartmentAttendance',

  // Payroll
  ManagePayroll = 'ManagePayroll',
  ProcessPayroll = 'ProcessPayroll',
  ViewPayslips = 'ViewPayslips',
  UpdateSalaryStructure = 'UpdateSalaryStructure',
  ManageBonuses = 'ManageBonuses',
  ManageDeductions = 'ManageDeductions',

  // Communication
  SendInternalMessage = 'SendInternalMessage',
  ManageAnnouncements = 'ManageAnnouncements',
  ReceiveNotifications = 'ReceiveNotifications',
  ManageTemplates = 'ManageTemplates',

  // Documents
  UploadDocuments = 'UploadDocuments',
  ApproveDocuments = 'ApproveDocuments',
  ArchiveDocuments = 'ArchiveDocuments',
  DeleteDocuments = 'DeleteDocuments',
  ViewDepartmentDocuments = 'ViewDepartmentDocuments',

  // Department Management
  CreateDepartment = 'CreateDepartment',
  EditDepartment = 'EditDepartment',
  DeleteDepartment = 'DeleteDepartment',
  AssignDepartmentHead = 'AssignDepartmentHead',
  ManageDepartmentStructure = 'ManageDepartmentStructure',

  // Reports
  ViewHRReports = 'ViewHRReports',
  GenerateDepartmentReports = 'GenerateDepartmentReports',
  ExportData = 'ExportData'
}
