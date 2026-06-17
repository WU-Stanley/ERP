import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { BulkStaffUploadResultDto } from '../dtos/bulk-staff-upload.dto';

@Injectable({ providedIn: 'root' })
export class StaffBulkUploadService {
  private readonly http = inject(HttpClient);
  private readonly env = inject<AppEnvironment>(ENVIRONMENT);

  uploadStaff(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<BulkStaffUploadResultDto>>(
      `${this.env.apiUrl}/Employees/bulk-upload`,
      formData,
      { withCredentials: true }
    );
  }
}
