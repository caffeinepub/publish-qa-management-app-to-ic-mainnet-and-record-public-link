import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';

export function BugDetailPage() {
  const navigate = useNavigate();
  const { bugId } = useParams({ strict: false });

  // Mock data - replace with actual backend data
  const bug = {
    id: bugId,
    title: 'Login button not responding on iOS',
    description: 'When attempting to login on iOS devices, the login button does not respond to touch events. This issue appears to be specific to iOS 16 and above.',
    severity: 'high',
    status: 'open',
    priority: 'urgent',
    reportedBy: 'John Doe',
    reportedAt: '2026-02-03',
    steps: [
      'Open the app on iOS device',
      'Navigate to login screen',
      'Enter valid credentials',
      'Tap login button',
      'Button does not respond'
    ],
    environment: 'iOS 16.5, iPhone 14 Pro',
  };

  return (
    <SectionPage
      title={bug.title}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/bugs' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate({ to: `/bugs/${bugId}/edit` })}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{bug.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Steps to Reproduce</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {bug.steps.map((step, idx) => (
                  <li key={idx} className="text-sm">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className="mt-1" variant="destructive">{bug.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Severity</p>
                <Badge className="mt-1" variant="destructive">{bug.severity}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge className="mt-1" variant="outline">{bug.priority}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reported By</p>
                <p className="mt-1 text-sm">{bug.reportedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reported At</p>
                <p className="mt-1 text-sm">{bug.reportedAt}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Environment</p>
                <p className="mt-1 text-sm">{bug.environment}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionPage>
  );
}
