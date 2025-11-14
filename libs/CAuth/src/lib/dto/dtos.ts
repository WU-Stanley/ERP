import { get } from 'https';
import { FeedingTimeLst, User } from './user.dto';

// 🔹 Enum equivalent for MealOrderStatus
export enum MealOrderStatus {
  Requested = 0,
  Approved = 1,
  Rejected = 2,
  Claimed = 3,
  Cancelled = 4,
  Refunded = 5,
}

// 🔹 Vendor Model
export interface VendorModel {
  id: string; // Guid
  vendorCode: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isApproved: boolean;
  vendorAdminId?: number | null; // foreign key to UserTbl
  vendorAdmin?: User | null;
  menuItems: MenuItem[];
  mealOrders: MealOrder[];
  dateJoined: string; // DateTime
}

// 🔹 Menu Item
export interface MenuItem {
  id: string; // Guid
  vendorId: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  isAvailable: boolean;
  availableDate: string; // DateTime
  feedingTimeId: number;
  feedingTime: FeedingTimeLst;
  vendor: VendorModel;
  createdAt: string; // DateTime
  updatedAt: string; // DateTime
}

// 🔹 Meal Order
export interface MealOrder {
  id: string; // Guid
  userId: number;
  vendorId: string;
  menuItemId: string;
  requestTime: string; // DateTime
  approvalTime?: string | null;
  claimTime?: string | null;
  status: MealOrderStatus;
  orderCode: string;
  user: User;
  vendor: VendorModel;
  menuItem: MenuItem;
  redemption?: MealRedemption | null;
}

// 🔹 Meal Redemption
export interface MealRedemption {
  id: string; // Guid
  mealOrderId: string;
  verifiedByUserId: number;
  redemptionTime: string; // DateTime
  isSuccessful: boolean;
  mealOrder: MealOrder;
  verifiedByUser: User;
}

// 🔹 Transaction Log
export interface TransactionLog {
  id: string; // Guid
  referenceId: string; // Guid
  entityType: string;
  action: string;
  remarks?: string | null;
  performedById: number;
  timestamp: string; // DateTime
  performedBy: User;
}

// 🔹 Student
export interface Student {
  id: string; // Guid
  matricNumber: string;
  fullName: string;
  email: string;
  department: string;
  faculty: string;
  isScholarshipBeneficiary: boolean;
  hasFreeMealEntitlement: boolean;
  mealOrders: MealOrder[];
  verifiedMealRedemptions: MealRedemption[];
}
export interface MealOrderDTO {
  menuItemId: string;
  id: string;
  menuItemName: string;
  description: string;
  claimTime: string;
  isRedeemed: boolean;
  imageUrl: string;
  status: string;
  price: number;
  vendorName: string;
  isProcessing?: boolean;
}
export interface FavoriteMenu {
  id: string; // Guid
  userId: number;
  menuItemId: string;
  savedAt: string; // DateTime
  menuItem: MenuItem;
  user: User;
}
