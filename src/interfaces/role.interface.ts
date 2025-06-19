import { PermissionI } from "./permission.interface";

export interface RoleI {
  id?: number;
  name: string;
  description: string;
  permissions?: PermissionI[]; 
}