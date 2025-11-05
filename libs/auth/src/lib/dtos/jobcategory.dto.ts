export interface JobCategoryDto {
  id: string; // Guid in C# maps to string in TypeScript
  name: string;
  description: string;
  isActive: boolean;
}
export interface CreateJobCategoryDto {
  name: string;
  description: string;
  isActive: boolean;
}
