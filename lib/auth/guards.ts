import { NextRequest } from 'next/server';
import { UserRole } from '@/lib/types/auth';
import { auth } from './auth';

export interface AuthResult {
  authorized: boolean;
  error: string | null;
  user: any | null;
}

export async function guard(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthResult> {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session) {
    return { authorized: false, error: 'Unauthorized', user: null };
  }

  const { user } = session;
  const userRole = (user as any).role || 'VENDOR';

  if (!allowedRoles.includes(userRole as UserRole)) {
    return { authorized: false, error: 'Forbidden', user };
  }

  return { authorized: true, error: null, user };
}

export const adminGuard = (request: NextRequest) => guard(request, ['ADMIN']);
export const vendorGuard = (request: NextRequest) => guard(request, ['VENDOR']);
export const authGuard = (request: NextRequest) => guard(request, ['ADMIN', 'VENDOR']);
