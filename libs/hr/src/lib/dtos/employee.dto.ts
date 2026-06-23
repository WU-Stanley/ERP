export interface EmployeeDirectoryDto {
  employeeId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  departmentId?: string | null;
  departmentName: string;
  employmentTypeName: string;
  employmentStatus: string;
  dateOfHire?: string | null;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface EmployeeDetailsDto {
  employeeId: string;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  address?: string;
  phoneNumber?: string;
  email: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  relationship?: string;
  bankName?: string;
  bankAccountNumber?: string;
  profilePicture?: string;
  cvUrl?: string;
  identificationUrl?: string;
  certificateUrl?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  employments?: EmploymentDetailsDto[];
}

export interface EmploymentDetailsDto {
  employmentId: string;
  employeeId: string;
  departmentId: string;
  jobTitle: string;
  jobCategory: string;
  employmentTypeId: string;
  employmentStatus: string;
  gradeLevel?: string;
  dateOfHire?: string;
  probationEndDate?: string | null;
  exitDate?: string | null;
  supervisorId?: string | null;
  salaryStructureId?: string;
  benefits?: string;
  promotionHistory?: string;
  transferHistory?: string;
  startDate?: string;
  endDate?: string | null;
  isActive: boolean;
  jobCategoryId?: string;
  department?: {
    id: string;
    code?: string;
    name: string;
    description?: string;
    departmentType?: string;
  };
  employmentType?: {
    id: string;
    name: string;
    description?: string;
    isActive?: boolean;
  };
}

export interface EmploymentAssignmentDto {
  departmentId: string;
  jobTitle: string;
  employmentTypeId: string;
  employmentStatus: string;
  gradeLevel?: string;
  dateOfHire: string;
  probationEndDate?: string | null;
  supervisorId?: string | null;
  salaryStructureId?: string | null;
  benefits?: string;
  promotionHistory?: string;
  transferHistory?: string;
  jobCategoryId?: string | null;
}

export interface EmployeeSelfServiceUpdateDto {
  address: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  bankName: string;
  bankAccountNumber: string;
  cvUrl?: string;
  identificationUrl?: string;
  certificateUrl?: string;
}

export interface EmployeeProfileUpdateRequestDto {
  id: string;
  employeeId: string;
  requestedByUserId: string;
  employeeName: string;
  employeeEmail: string;
  currentValues: EmployeeSelfServiceUpdateDto;
  proposedValues: EmployeeSelfServiceUpdateDto;
  status: string;
  comment?: string | null;
  reviewedByUserId?: string | null;
  requestedAt: string;
  reviewedAt?: string | null;
}

export interface ProfileUpdateDecisionDto {
  isApproved: boolean;
  comment?: string | null;
}
