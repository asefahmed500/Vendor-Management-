import { redirect } from 'next/navigation';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  // If registration is explicitly disabled, redirect to login
  if (process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'false' || process.env.ENABLE_REGISTRATION === 'false') {
    redirect('/login');
  }
  
  return <>{children}</>;
}
