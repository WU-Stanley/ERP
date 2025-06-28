import { User } from "./user.dto";

 
export interface MFAToken {
  id: string;
  token: string;
  expiresOn: string; // ISO 8601 date string
  userId?: string;
  clientId: string;
  createdAt: string; // ISO 8601 date string
  user?: User;
}
