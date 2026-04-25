import { type ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-zinc-50 relative overflow-hidden flex items-center justify-center px-4 py-20 selection:bg-zinc-950 selection:text-white">
      {/* Principal Background Architecture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full opacity-30" />
         {/* Noise & Grid Shards */}
         <div className="absolute inset-0 opacity-[0.015] bg-[url('/noise.png')] mix-blend-overlay" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
        {children}
      </div>
    </div>
  );
}
