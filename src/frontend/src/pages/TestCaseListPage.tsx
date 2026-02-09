import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TestTube } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function TestCaseListPage() {
  const navigate = useNavigate();

  // Mock data - replace with actual backend data
  const testCases = [
    { id: '1', title: 'User Login Flow', category: 'Authentication', priority: 'high', status: 'active' },
    { id: '2', title: 'Checkout Process', category: 'E-commerce', priority: 'high', status: 'active' },
    { id: '3', title: 'Profile Update', category: 'User Management', priority: 'medium', status: 'active' },
  ];

  if (testCases.length === 0) {
    return (
      <SectionPage
        title="Test Cases"
        description="Manage your test case library"
        actions={
          <Button onClick={() => navigate({ to: '/test-cases/new' })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Test Case
          </Button>
        }
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <img
              src="/assets/generated/empty-testcases.dim_1200x800.png"
              alt="No test cases"
              className="mb-6 h-48 w-auto opacity-50"
            />
            <h3 className="mb-2 text-lg font-semibold">No test cases yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Create your first test case to get started</p>
            <Button onClick={() => navigate({ to: '/test-cases/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Test Case
            </Button>
          </CardContent>
        </Card>
      </SectionPage>
    );
  }

  return (
    <SectionPage
      title="Test Cases"
      description="Manage your test case library"
      actions={
        <Button onClick={() => navigate({ to: '/test-cases/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Test Case
        </Button>
      }
    >
      <div className="space-y-4">
        {testCases.map((testCase) => (
          <Card
            key={testCase.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => navigate({ to: `/test-cases/${testCase.id}` })}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-start gap-4">
                <TestTube className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{testCase.title}</h3>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline">{testCase.category}</Badge>
                    <Badge variant="default">{testCase.priority}</Badge>
                    <Badge variant="secondary">{testCase.status}</Badge>
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
