import type { ReactNode } from 'react';

export default function PageTransition({ children, key }: { children: ReactNode; key?: string }) {
  return (
    <div key={key} className="animate-fade-in">
      {children}
    </div>
  );
}
