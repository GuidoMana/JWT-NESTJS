import { RoleI } from "./role.interface";

export interface UserI {
  id: number
  email: string;
  password: string;
  permissionCodes?: string[];
  role?: RoleI; 
}