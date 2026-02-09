import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Bug } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function BugListPage() {
  const navigate = useNavigate();

  // Mock data - replace with actual backend data
  const bugs = [
    { id: '1', title: 'Login button not responding on iOS', severity: 'high', status: 'open', priority: 'urgent' },
    { id: '2', title: 'Image upload fails on Android', severity: 'medium', status: 'in-progress', priority: 'high' },
    { id: '3', title: 'Text alignment issue in profile', severity: 'low', status: 'open', priority: 'medium' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in-progress': return 'default';
      case 'resolved': return 'secondary';
      default: return 'default';
    }
  };

  if (bugs.length === 0) {
    return (
      <SectionPage
        title="Bugs"
        description="Track and manage bugs found during testing"
        actions={
          <Button onClick={() => navigate({ to: '/bugs/new' })}>
            <Plus className="mr-2 h-4 w-4" />
            Report Bug
          </Button>
        }
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <img
              src="/assets/generated/empty-bugs.dim_1200x800.png"
              alt="No bugs"
              className="mb-6 h-48 w-auto opacity-50"
            />
            <h3 className="mb-2 text-lg font-semibold">No bugs reported yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Get started by reporting your first bug</p>
            <Button onClick={() => navigate({ to: '/bugs/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              Report Bug
            </Button>
          </CardContent>
        </Card>
      </SectionPage>
    );
  }

  return (
    <SectionPage
      title="Bugs"
      description="Track and manage bugs found during testing"
      actions={
        <Button onClick={() => navigate({ to: '/bugs/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          Report Bug
        </Button>
      }
    >
      <div className="space-y-4">
        {bugs.map((bug) => (
          <Card
            key={bug.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => navigate({ to: `/bugs/${bug.id}` })}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-start gap-4">
                <Bug className="mt-1 h-5 w-5 text-destructive" />
                <div>
                  <h3 className="font-semibold">{bug.title}</h3>
                  <div className="mt-2 flex gap-2">
                    <Badge variant={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                    <Badge variant={getStatusColor(bug.status)}>{bug.status}</Badge>
                    <Badge variant="outline">{bug.priority}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
