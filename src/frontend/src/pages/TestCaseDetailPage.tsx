import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';

export function TestCaseDetailPage() {
  const navigate = useNavigate();
  const { testCaseId } = useParams({ strict: false });

  // Mock data - replace with actual backend data
  const testCase = {
    id: testCaseId,
    title: 'User Login Flow',
    description: 'Verify that users can successfully log in to the application with valid credentials.',
    category: 'Authentication',
    priority: 'high',
    status: 'active',
    preconditions: 'User account must exist in the system',
    steps: [
      'Navigate to login page',
      'Enter valid email address',
      'Enter valid password',
      'Click login button',
      'Verify successful login and redirect to dashboard'
    ],
    expectedResult: 'User is logged in and redirected to the dashboard',
    createdBy: 'Jane Smith',
    createdAt: '2026-01-15',
  };

  return (
    <SectionPage
      title={testCase.title}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/test-cases' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate({ to: `/test-cases/${testCaseId}/edit` })}>
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
              <p className="text-sm">{testCase.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preconditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{testCase.preconditions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {testCase.steps.map((step, idx) => (
                  <li key={idx} className="text-sm">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{testCase.expectedResult}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <Badge className="mt-1" variant="outline">{testCase.category}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge className="mt-1" variant="default">{testCase.priority}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className="mt-1" variant="secondary">{testCase.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="mt-1 text-sm">{testCase.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="mt-1 text-sm">{testCase.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionPage>
  );
}
