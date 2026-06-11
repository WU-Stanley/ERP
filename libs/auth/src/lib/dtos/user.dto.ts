import { DepartmentDto } from "./department.dto";
import { MFAToken } from "./mfatoken.dto";
import { UserPermissionDto } from "./permission.dto";
import { UserRole } from "./user-roles.dto";
import { UserTypeDto } from "./usertype.dto";

 

export interface User {
  id: string;

  userName?: string;
  fullName?: string;
  userEmail: string;
  password?: string;
  resetPassordToken?: string;

  isDefault: boolean;
  dateLastLoggedIn?: string; // ISO 8601 format e.g. '2025-06-27T12:30:00Z'

  createdById: string;
  dateCreated: string; // ISO string

  singleSignOnEnabled: boolean;

  sessionId?: string;
  sessionTime?: string; // ISO string

  userTypeId: string;
  userType?: UserTypeDto;

  deptId?: string;
  department?: DepartmentDto;

  userPermissions?: UserPermissionDto[];
  userRoles?: UserRole[];

  twoFactorEnabled: boolean;

  mfaTokens?: MFAToken[];
}
