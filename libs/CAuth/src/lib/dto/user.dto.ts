import { MealOrder, MealRedemption, TransactionLog, VendorModel } from './dtos';

export interface User {
  userId: number;

  // 🔹 Core Identity Fields
  userName: string;
  fullName: string;
  userEmail: string;
  phoneNumber?: string | null;
  password: string;

  // 🔹 Role and Department
  roleId: number;

  // 🔹 Account Metadata
  isActive: boolean;
  isDefault: boolean;
  singleSignOnEnabled: boolean;

  dateCreated: string; // ISO string (UTC)
  dateLastLoggedIn?: string | null;

  // 🔹 Session Information
  sessionId?: string | null;
  sessionTime?: string | null;

  // 🔹 Audit
  createdById?: number | null;
  createdBy?: User | null;

  // 🔹 Role and Department Navigation
  role?: RoleTbl | null;

  // 🔹 Relational Links
  userVerifiedMealRedemptions: MealRedemption[];
  userTransactionLogs: TransactionLog[];

  managedVendor?: VendorModel | null;
  remoteUserId?: number | null;
  createdUsers: User[];

  // 🔹 Derived (computed) properties
  displayName: string;
  isStudent: boolean;
  isVendor: boolean;
  isAdmin: boolean;

  mealOrders: MealOrder[];
}
export interface RoleTbl {
  roleId: number; // Primary key
  roleName?: string | null; // Optional short name
  roleDescription?: string | null; // Optional long description
  createdById: number; // ID of creator
  dateCreated: string; // ISO string date
  modifiedById?: number | null; // Nullable modifier ID
  dateModified?: string | null; // Nullable modification date
}
export interface FeedingTimeLst {
  feedingTimeId: number; // int
  feedingTimeName: string; // nvarchar(60)
  feedingTimeDescription?: string | null; // nullable nvarchar(60)
  createdById: number; // foreign key to UserTbl
  dateCreated: string; // DateTime (ISO string)
  modifiedById?: number | null; // nullable foreign key
  dateModified?: string | null; // nullable DateTime

  // Navigation properties
  createdBy: User; // reference to creator
  modifiedBy?: User | null; // reference to modifier
}
export interface CreateMenuItemRequest {
  mealName: string;
  mealDescription: string;
  mealPrice: number;
  availableDate: Date;
  feedingTimeId: number;
  vendorId: string;
  mealImage?: File | null;
  imageUrl?: string;
}
