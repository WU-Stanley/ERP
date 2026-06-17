export interface BulkStaffUploadRowErrorDto {
  rowNumber: number;
  email: string;
  message: string;
}

export interface BulkStaffUploadResultDto {
  totalRows: number;
  createdRows: number;
  failedRows: number;
  errors: BulkStaffUploadRowErrorDto[];
}
