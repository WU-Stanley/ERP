import { RoleDto } from "./role.dto";
import { User } from "./user.dto";



export interface UserRole {
  userId?: string;
  user?: User;

  roleId: string;
  role?: RoleDto;
  name?: string;
  description?: string;

  rolePermissions?: any[];

  assignedAt?: string; // ISO 8601 date string
  assignedBy?: string;
}
