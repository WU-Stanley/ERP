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
  fullName: string;
  email: string;
  userTypeId: string;
  departmentId: string;
}
