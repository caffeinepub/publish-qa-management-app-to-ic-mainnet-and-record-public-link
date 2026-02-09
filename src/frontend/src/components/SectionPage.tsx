import { type ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface SectionPageProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionPage({ title, description, actions, children }: SectionPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
