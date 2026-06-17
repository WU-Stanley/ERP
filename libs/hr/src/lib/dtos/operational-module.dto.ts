export interface ModuleSummaryDto {
  salaryStructureCount: number;
  payrollRunCount: number;
  pendingProcurementRequestCount: number;
  lowStockInventoryItemCount: number;
  documentCount: number;
  openHelpdeskTicketCount: number;
  facilityAssetCount: number;
  registryIntegrationCount: number;
}

export interface SalaryStructureDto {
  id: string;
  code: string;
  name: string;
  gradeLevel: string;
  basePay: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  taxRatePercent: number;
  pensionRatePercent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSalaryStructureDto {
  code: string;
  name: string;
  gradeLevel: string;
  basePay: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  taxRatePercent: number;
  pensionRatePercent: number;
  isActive: boolean;
}

export interface PayrollRunDto {
  id: string;
  periodName: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  employeeCount: number;
  grossPayTotal: number;
  netPayTotal: number;
  processedByUserId?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePayrollRunDto {
  periodName: string;
  periodStart: string;
  periodEnd: string;
  employeeCount: number;
  grossPayTotal: number;
  netPayTotal: number;
}

export interface UpdateOperationalStatusDto {
  status: string;
  comment?: string;
}

export interface ProcurementRequestDto {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  departmentId?: string;
  requestedByUserId?: string;
  estimatedAmount: number;
  priority: string;
  status: string;
  neededBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProcurementRequestDto {
  title: string;
  description: string;
  departmentId?: string;
  requestedByUserId?: string;
  estimatedAmount: number;
  priority: string;
  neededBy?: string;
}

export interface InventoryItemDto {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantityOnHand: number;
  reorderLevel: number;
  unitCost: number;
  location: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInventoryItemDto {
  sku: string;
  name: string;
  category: string;
  quantityOnHand: number;
  reorderLevel: number;
  unitCost: number;
  location: string;
  status: string;
}

export interface DocumentRecordDto {
  id: string;
  title: string;
  category: string;
  ownerDepartmentId?: string;
  ownerUserId?: string;
  storageUrl: string;
  confidentiality: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDocumentRecordDto {
  title: string;
  category: string;
  ownerDepartmentId?: string;
  ownerUserId?: string;
  storageUrl: string;
  confidentiality: string;
  status: string;
}

export interface HelpdeskTicketDto {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  requesterUserId?: string;
  assigneeUserId?: string;
  dueAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateHelpdeskTicketDto {
  title: string;
  description: string;
  category: string;
  priority: string;
  requesterUserId?: string;
  assigneeUserId?: string;
  dueAt?: string;
}

export interface HelpdeskTicketCommentDto {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  comment: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHelpdeskCommentDto {
  comment: string;
  isInternal: boolean;
}

export interface HelpdeskTicketDetailDto {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  requesterUserId?: string;
  requesterName: string;
  assigneeUserId?: string;
  assigneeName: string;
  dueAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments: HelpdeskTicketCommentDto[];
}

export interface FacilityAssetDto {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  location: string;
  custodianEmployeeId?: string;
  condition: string;
  status: string;
  purchaseDate?: string;
  purchaseCost: number;
  warrantyExpiryDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFacilityAssetDto {
  assetTag: string;
  name: string;
  category: string;
  location: string;
  custodianEmployeeId?: string;
  condition: string;
  status: string;
  purchaseDate?: string;
  purchaseCost: number;
  warrantyExpiryDate?: string;
}

export interface RegistryIntegrationRecordDto {
  id: string;
  systemName: string;
  integrationType: string;
  externalUrl: string;
  status: string;
  lastSyncedAt?: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRegistryIntegrationDto {
  systemName: string;
  integrationType: string;
  externalUrl: string;
  status: string;
  lastSyncedAt?: string;
  notes: string;
}
