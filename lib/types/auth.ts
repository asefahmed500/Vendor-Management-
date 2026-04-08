export type UserRole = 'ADMIN' | 'VENDOR';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  password?: string;
  role: UserRole;
  vendorProfile?: string;
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  mustChangePassword?: boolean;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserWithoutPassword = Omit<IUser, 'password'>;

/**
 * User object returned by Better Auth session
 * This matches the structure from Better Auth with additional fields
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields from our Better Auth config
  role: UserRole;
  vendorProfile?: string;
  isActive: boolean;
  // Registration fields (temporary, stored on user for hooks)
  companyName?: string;
  contactPerson?: string;
  phone?: string;
}

export interface IJwtPayload {
  userId: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: IUserWithoutPassword;
  tokens: ITokens;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface IRegisterInput {
  email: string;
  password: string;
  role: UserRole;
}
