export interface ApiResponse<T> {
  message: string;
  status: boolean;
  data?: T;
  error?: any;
}
