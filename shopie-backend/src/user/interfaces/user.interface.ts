import { UserRole } from '../../../shared/enums/user-role.enum';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordCode?: string | null;
  resetPasswordCodeExpiry?: Date | null;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
