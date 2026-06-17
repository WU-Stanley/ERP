import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import {
  CreatePayrollRunDto,
  CreateInventoryItemDto,
  CreateDocumentRecordDto,
  CreateHelpdeskTicketDto,
  CreateFacilityAssetDto,
  CreateRegistryIntegrationDto,
  CreateProcurementRequestDto,
  CreateSalaryStructureDto,
  DocumentRecordDto,
  FacilityAssetDto,
  HelpdeskTicketDto,
  HelpdeskTicketDetailDto,
  HelpdeskTicketCommentDto,
  CreateHelpdeskCommentDto,
  InventoryItemDto,
  ModuleSummaryDto,
  PayrollRunDto,
  ProcurementRequestDto,
  RegistryIntegrationRecordDto,
  SalaryStructureDto,
  UpdateOperationalStatusDto,
} from '../dtos/operational-module.dto';

@Injectable({ providedIn: 'root' })
export class OperationalModulesService {
  private readonly http = inject(HttpClient);
  private readonly env = inject<AppEnvironment>(ENVIRONMENT);
  private readonly baseUrl = `${this.env.apiUrl}/erp-modules`;

  getSummary() {
    return this.http.get<ApiResponse<ModuleSummaryDto>>(`${this.baseUrl}/summary`, {
      withCredentials: true,
    });
  }

  getSalaryStructures() {
    return this.http.get<ApiResponse<SalaryStructureDto[]>>(
      `${this.baseUrl}/finance/salary-structures`,
      { withCredentials: true }
    );
  }

  createSalaryStructure(payload: CreateSalaryStructureDto) {
    return this.http.post<ApiResponse<SalaryStructureDto>>(
      `${this.baseUrl}/finance/salary-structures`,
      payload,
      { withCredentials: true }
    );
  }

  updateSalaryStructure(id: string, payload: CreateSalaryStructureDto) {
    return this.http.put<ApiResponse<SalaryStructureDto>>(
      `${this.baseUrl}/finance/salary-structures/${id}`,
      payload,
      { withCredentials: true }
    );
  }

  getPayrollRuns() {
    return this.http.get<ApiResponse<PayrollRunDto[]>>(
      `${this.baseUrl}/finance/payroll-runs`,
      { withCredentials: true }
    );
  }

  createPayrollRun(payload: CreatePayrollRunDto) {
    return this.http.post<ApiResponse<PayrollRunDto>>(
      `${this.baseUrl}/finance/payroll-runs`,
      payload,
      { withCredentials: true }
    );
  }

  updatePayrollRunStatus(id: string, payload: UpdateOperationalStatusDto) {
    return this.http.patch<ApiResponse<PayrollRunDto>>(
      `${this.baseUrl}/finance/payroll-runs/${id}/status`,
      payload,
      { withCredentials: true }
    );
  }

  getProcurementRequests(status?: string) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<ProcurementRequestDto[]>>(
      `${this.baseUrl}/procurement/requests`,
      { params, withCredentials: true }
    );
  }

  createProcurementRequest(payload: CreateProcurementRequestDto) {
    return this.http.post<ApiResponse<ProcurementRequestDto>>(
      `${this.baseUrl}/procurement/requests`,
      payload,
      { withCredentials: true }
    );
  }

  updateProcurementRequestStatus(id: string, payload: UpdateOperationalStatusDto) {
    return this.http.patch<ApiResponse<ProcurementRequestDto>>(
      `${this.baseUrl}/procurement/requests/${id}/status`,
      payload,
      { withCredentials: true }
    );
  }

  getInventoryItems(lowStockOnly = false) {
    return this.http.get<ApiResponse<InventoryItemDto[]>>(
      `${this.baseUrl}/procurement/inventory`,
      {
        withCredentials: true,
        params: { lowStockOnly },
      }
    );
  }

  createInventoryItem(payload: CreateInventoryItemDto) {
    return this.http.post<ApiResponse<InventoryItemDto>>(
      `${this.baseUrl}/procurement/inventory`,
      payload,
      { withCredentials: true }
    );
  }

  updateInventoryItem(id: string, payload: CreateInventoryItemDto) {
    return this.http.put<ApiResponse<InventoryItemDto>>(
      `${this.baseUrl}/procurement/inventory/${id}`,
      payload,
      { withCredentials: true }
    );
  }

  getDocuments(category?: string) {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<ApiResponse<DocumentRecordDto[]>>(
      `${this.baseUrl}/documents`,
      { params, withCredentials: true }
    );
  }

  createDocument(payload: CreateDocumentRecordDto) {
    return this.http.post<ApiResponse<DocumentRecordDto>>(
      `${this.baseUrl}/documents`,
      payload,
      { withCredentials: true }
    );
  }

  updateDocumentStatus(id: string, payload: UpdateOperationalStatusDto) {
    return this.http.patch<ApiResponse<DocumentRecordDto>>(
      `${this.baseUrl}/documents/${id}/status`,
      payload,
      { withCredentials: true }
    );
  }

  getHelpdeskTickets(status?: string) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<HelpdeskTicketDto[]>>(
      `${this.baseUrl}/helpdesk/tickets`,
      { params, withCredentials: true }
    );
  }

  createHelpdeskTicket(payload: CreateHelpdeskTicketDto) {
    return this.http.post<ApiResponse<HelpdeskTicketDto>>(
      `${this.baseUrl}/helpdesk/tickets`,
      payload,
      { withCredentials: true }
    );
  }

  updateHelpdeskTicketStatus(id: string, payload: UpdateOperationalStatusDto) {
    return this.http.patch<ApiResponse<HelpdeskTicketDto>>(
      `${this.baseUrl}/helpdesk/tickets/${id}/status`,
      payload,
      { withCredentials: true }
    );
  }

  getHelpdeskTicketDetail(id: string) {
    return this.http.get<ApiResponse<HelpdeskTicketDetailDto>>(
      `${this.baseUrl}/helpdesk/tickets/${id}`,
      { withCredentials: true }
    );
  }

  addHelpdeskTicketComment(id: string, payload: CreateHelpdeskCommentDto) {
    return this.http.post<ApiResponse<HelpdeskTicketCommentDto>>(
      `${this.baseUrl}/helpdesk/tickets/${id}/comments`,
      payload,
      { withCredentials: true }
    );
  }

  getFacilityAssets(status?: string) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<FacilityAssetDto[]>>(
      `${this.baseUrl}/facilities/assets`,
      { params, withCredentials: true }
    );
  }

  createFacilityAsset(payload: CreateFacilityAssetDto) {
    return this.http.post<ApiResponse<FacilityAssetDto>>(
      `${this.baseUrl}/facilities/assets`,
      payload,
      { withCredentials: true }
    );
  }

  updateFacilityAsset(id: string, payload: CreateFacilityAssetDto) {
    return this.http.put<ApiResponse<FacilityAssetDto>>(
      `${this.baseUrl}/facilities/assets/${id}`,
      payload,
      { withCredentials: true }
    );
  }

  getRegistryIntegrations() {
    return this.http.get<ApiResponse<RegistryIntegrationRecordDto[]>>(
      `${this.baseUrl}/registry/integrations`,
      { withCredentials: true }
    );
  }

  createRegistryIntegration(payload: CreateRegistryIntegrationDto) {
    return this.http.post<ApiResponse<RegistryIntegrationRecordDto>>(
      `${this.baseUrl}/registry/integrations`,
      payload,
      { withCredentials: true }
    );
  }

  updateRegistryIntegrationStatus(id: string, payload: UpdateOperationalStatusDto) {
    return this.http.patch<ApiResponse<RegistryIntegrationRecordDto>>(
      `${this.baseUrl}/registry/integrations/${id}/status`,
      payload,
      { withCredentials: true }
    );
  }
}
