import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, PlayCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function TestRunListPage() {
  const navigate = useNavigate();

  // Mock data - replace with actual backend data
  const testRuns = [
    { id: '1', name: 'Sprint 12 Regression', status: 'completed', passed: 45, failed: 3, total: 48, date: '2026-02-03' },
    { id: '2', name: 'Login Flow Tests', status: 'in-progress', passed: 8, failed: 0, total: 12, date: '2026-02-04' },
    { id: '3', name: 'Payment Integration', status: 'pending', passed: 0, failed: 0, total: 15, date: '2026-02-04' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'in-progress': return 'default';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <SectionPage
      title="Test Runs"
      description="Execute and track test run results"
      actions={
        <Button onClick={() => navigate({ to: '/test-runs/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Test Run
        </Button>
      }
    >
      <div className="space-y-4">
        {testRuns.map((run) => (
          <Card
            key={run.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => navigate({ to: `/test-runs/${run.id}` })}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <PlayCircle className="mt-1 h-5 w-5 text-chart-2" />
                  <div>
                    <h3 className="font-semibold">{run.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{run.date}</p>
                    <div className="mt-3 flex gap-2">
                      <Badge variant={getStatusColor(run.status)}>{run.status}</Badge>
                      {run.status === 'completed' && (
                        <>
                          <Badge variant="secondary">{run.passed} passed</Badge>
                          {run.failed > 0 && <Badge variant="destructive">{run.failed} failed</Badge>}
                        </>
                      )}
                      {run.status === 'in-progress' && (
                        <Badge variant="outline">{run.passed}/{run.total} completed</Badge>
                      )}
                    </div>
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
