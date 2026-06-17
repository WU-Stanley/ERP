export interface DepartmentDto {
  isActive: boolean;
  description: string;
  headOfDepartmentId?: string | null;
  id: string;
  name: string;
}
