export interface UserTypeDto {
  createdAt: Date;
  description: string;
  id: string;
  isActive: boolean;
  name: string;
  updatedAt: Date;
}

export interface UserDto {
  id: string;
  employeeId?: string | null;
  fullName: string;
  email: string;
  userTypeId: string;
  departmentId?: string | null;
}
export interface EmploymentTypeDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
