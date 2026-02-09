import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';

export function TestRunSummaryPage() {
  const navigate = useNavigate();
  const { testRunId } = useParams({ strict: false });

  // Mock data - replace with actual backend data
  const testRun = {
    id: testRunId,
    name: 'Sprint 12 Regression',
    status: 'completed',
    startedAt: '2026-02-03 10:00',
    completedAt: '2026-02-03 11:30',
    executedBy: 'John Doe',
    results: [
      { id: '1', title: 'User Login Flow', status: 'passed', notes: '' },
      { id: '2', title: 'Checkout Process', status: 'passed', notes: '' },
      { id: '3', title: 'Profile Update', status: 'failed', notes: 'Save button not responding on iOS' },
    ],
  };

  const passedCount = testRun.results.filter(r => r.status === 'passed').length;
  const failedCount = testRun.results.filter(r => r.status === 'failed').length;
  const passRate = Math.round((passedCount / testRun.results.length) * 100);

  return (
    <SectionPage
      title={testRun.name}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/test-runs' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Test Runs
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testRun.results.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-1">{passedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{failedCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testRun.results.map((result) => (
                  <div key={result.id} className="flex items-start gap-3 rounded-lg border p-4">
                    {result.status === 'passed' ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-chart-1" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{result.title}</p>
                        <Badge variant={result.status === 'passed' ? 'secondary' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                      {result.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{result.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className="mt-1" variant="secondary">{testRun.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="mt-1 text-2xl font-bold">{passRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Executed By</p>
                <p className="mt-1 text-sm">{testRun.executedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Started At</p>
                <p className="mt-1 text-sm">{testRun.startedAt}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed At</p>
                <p className="mt-1 text-sm">{testRun.completedAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionPage>
  );
}
