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
  createdAt: Date;
  updatedAt: Date;
}

export type IUserWithoutPassword = Omit<IUser, 'password'>;

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
